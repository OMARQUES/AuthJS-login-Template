"use server"

import { getUserByEmail, getUserByID, updateUserByID } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/schemas"
import { unstable_update as update} from "@/auth"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { signOut } from "next-auth/react"

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {

    const user = await currentUser()
    if(!user){
        return {error: "Não autorizado!"}
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

        const updateEmail = await updateUserByID(
            user.id, 
            {
                email: values.email, 
                emailVerified: null
            })
        
        if(!updateEmail) return {error: "Erro ao atualizar o email!"}

        const verificationToken = await generateVerificationToken(values.email)

        if(!verificationToken){
            return {error: "Erro ao gerar token de verificação!"}
        }
        
        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return {success: "Email de verificação enviado!"}
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

    const updateUser = await updateUserByID(dbUser.id, values)

    await update({
        user: {
            name: updateUser.name,
            email: updateUser.email,
            isTwoFactorEnabled: updateUser.isTwoFactorEnabled,
            role: updateUser.role            
        }
    })

    return {success: "Configurações salvas!"}
}