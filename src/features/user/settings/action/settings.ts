"use server"

import { getUserByEmail, getUserByID, updateUserByID } from "@/src/data/user"
import { currentUser } from "@/src/lib/auth"
import { sendVerificationEmail } from "@/src/lib/mail"
import { generateVerificationToken } from "@/src/lib/tokens"
import { SettingsSchema } from "../schemas"
import { unstable_update as update} from "@/src/auth"
import { ERROR, SUCCESS } from "@/src/utils/constants"

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

    const formData = {
        email: values.email !== user?.email,
        password: values.password !== undefined,
        newPassword: values.newPassword !== undefined,
        isTwoFactorEnabled: values.isTwoFactorEnabled !== user?.isTwoFactorEnabled,
        role: values.role !== user?.role,
        name: values.name !== user?.name
    };

    const hasChanges = Object.values(formData).includes(true);

    if (!hasChanges && !user.isOAuth) {
        return { error: ERROR.NO_CHANGES };
    }

    if (!formData.name && !formData.role && user.isOAuth) {
        return { error: ERROR.NO_CHANGES };
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
        { ...values, emailVerified: formData.email ? null : undefined })

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

    return {success: SUCCESS.SETTINGS_SAVED, emailHasChanged: formData.email}
}