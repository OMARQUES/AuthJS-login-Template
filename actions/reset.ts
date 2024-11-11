"use server"

import { getAccountByUserId } from "@/data/account"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/schemas"
import * as z from "zod"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validadedFields = ResetSchema.safeParse(values)

    if(!validadedFields.success){
        return {error: "Email inválido!"}
    }

    const { email } = validadedFields.data

    const existingUser = await getUserByEmail(email)    

    if(!existingUser){
        return {error: "Email não cadastrado!"}
    }

    const isOAuth = await getAccountByUserId(existingUser.id)

    if(isOAuth){
        return {error: "Email vinculado a uma rede social!"}
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return {success: "Email de recuperação enviado!"}
}