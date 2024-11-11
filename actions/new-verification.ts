"use server"

import { getUserByEmail, updateUserByID } from "@/data/user"
import { deleteVerificationTokenByTokenID, getVerificationTokenByToken } from "@/data/verificationToken"

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)
    if (!existingToken) {
        return {error: "Token não existe!"}
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return {error: "Token expirado!"}
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        return {error: "Email não encontrado!"}
    }

    const updateUser = await updateUserByID(
        existingUser.id, 
        {
            emailVerified: new Date(), 
            email: existingToken.email
        })

    if(!updateUser) return {error: "Erro ao verificar o email!"}

    await deleteVerificationTokenByTokenID(existingToken)

    return {success: "Email verificado com sucesso!"}
}