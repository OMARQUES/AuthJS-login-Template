"use server"

import { getUserByEmail, getUserByID, updateUserByID } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/schemas"
import { unstable_update as update} from "@/auth"
import { ERROR, SUCCESS } from "@/utils/constants"

import bcrypt from "bcryptjs"
import * as z from "zod"

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {

    const validadeFields = SettingsSchema.safeParse(values)

    if (!validadeFields.success) {
        return {error: ERROR.INVALID_DATA}
    }

    const user = await currentUser()
    if(!user){
        return {error: ERROR.UNAUTHORIZED}
    }

    const emailHasChanged = (values.email !== user?.email) // Logout if email is updated
    const passwordHasChanged = (values.password !== undefined)
    const newPasswordHasChanged = (values.newPassword !== undefined)
    const twoFactorHasChanged = (values.isTwoFactorEnabled !== user?.isTwoFactorEnabled)
    const roleHasChanged = (values.role !== user?.role)
    const nameHasChanged = (values.name !== user?.name)

    if(!emailHasChanged && !passwordHasChanged && !newPasswordHasChanged && 
        !twoFactorHasChanged && !roleHasChanged && !nameHasChanged && !user.isOAuth){
        return {error: ERROR.NO_CHANGES}
    }

    if(!nameHasChanged && !roleHasChanged && user.isOAuth){
        return {error: ERROR.NO_CHANGES}
    }

    const dbUser = await getUserByID(user.id)

    if(!dbUser){
        return {error: ERROR.UNAUTHORIZED}
    }

    if(user.isOAuth){
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }
    
    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email)

        if(existingUser && existingUser.id !== user.id){
            return {error: ERROR.EMAIL_IN_USE}
        }

        const verificationToken = await generateVerificationToken(values.email)

        if(!verificationToken){
            return {error: ERROR.GENERATING_VERIFICATION_CODE}
        }
        
        const sendVerificationToken = await sendVerificationEmail(verificationToken.email, verificationToken.token)

        if(!sendVerificationToken){
            return {error: ERROR.EMAIL_VERIFICATION_SENT_ERROR}
        }
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password)

        if(!passwordsMatch){
            return {error: ERROR.INVALID_PASSWORD}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10)

        values.password = hashedPassword
        values.newPassword = undefined
    }

    const updateUser = await updateUserByID(dbUser.id, 
        { ...values, emailVerified: emailHasChanged ? null : undefined })

    if(!updateUser){
        return {error: ERROR.SETTINGS_UPDATE_ERROR}
    }

    await update({
        user: {
            name: updateUser.name,
            email: updateUser.email,
            isTwoFactorEnabled: updateUser.isTwoFactorEnabled,
            role: updateUser.role            
        }
    })

    return {success: SUCCESS.SETTINGS_SAVED, emailHasChanged}
}