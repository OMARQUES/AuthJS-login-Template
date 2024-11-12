"use server"

import { getUserByEmail, getUserByID, updateUserByID } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/schemas"
import { unstable_update as update} from "@/auth"

import * as z from "zod"
import bcrypt from "bcryptjs"

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    var emailHasChanged = false // Logout if email is updated

    const validadeFields = SettingsSchema.safeParse(values)

    if (!validadeFields.success) {
        return {error: "Dados inválidos!"}
    }

    const user = await currentUser()
    if(!user){
        return {error: "Não autorizado!"}
    }

    if(values.email === user.email &&
        values.name === user.name &&
        values.isTwoFactorEnabled === user.isTwoFactorEnabled &&
        values.role === user.role &&
        (!values.password || !values.newPassword) &&
        !user.isOAuth){
            return {error: "Nenhuma alteração detectada!"}
        }

    if(values.name === user.name &&
        values.role === user.role &&
        user.isOAuth){
        return {error: "Nenhuma alteração detectada!"}
    }

    const dbUser = await getUserByID(user.id)

    if(!dbUser){
        return {error: "Não autorizado!"}
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
            return {error: "Email já cadastrado!"}
        }

        const verificationToken = await generateVerificationToken(values.email)

        if(!verificationToken){
            return {error: "Erro ao gerar token de verificação!"}
        }
        
        const sendVerificationToken = await sendVerificationEmail(verificationToken.email, verificationToken.token)

        if(!sendVerificationToken){
            return {error: "Erro ao enviar email de verificação!"}
        }

        emailHasChanged = true
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password)

        if(!passwordsMatch){
            return {error: "Senha atual incorreta!"}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10)

        values.password = hashedPassword
        values.newPassword = undefined
    }

    const updateUser = await updateUserByID(dbUser.id, 
        { ...values, emailVerified: emailHasChanged ? null : undefined })

    if(!updateUser){
        return {error: "Erro ao atualizar as configurações!"}
    }

    await update({
        user: {
            name: updateUser.name,
            email: updateUser.email,
            isTwoFactorEnabled: updateUser.isTwoFactorEnabled,
            role: updateUser.role            
        }
    })

    return {success: "Configurações salvas!", emailHasChanged}
}