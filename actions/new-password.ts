"use server"

import { getPasswordResetTokenByToken } from "@/data/passwordVerificationToken"
import { getUserByEmail } from "@/data/user"
import { NewPasswordSchema } from "@/schemas"
import * as z from "zod"
import bcryps from "bcryptjs"
import { db } from "@/lib/db"

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if(!token) {
        return { error: "Token não encontrado!" }
    }

    const validatedFields = NewPasswordSchema.safeParse(values)

    if(!validatedFields.success) {
        return { error: "Erro de validação!" }
    }

    const { password } = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return { error: "Token inválido!" }
    }

    const hasExperided = new Date(existingToken.expires) < new Date()

    if(hasExperided) {
        return { error: "Token expirado!" }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser) {
        return { error: "Email não encontrado!" }
    }

    const hashedPassword = await bcryps.hash(password, 10)

    await db.user.update({
        where: {id: existingUser.id},
        data: {password: hashedPassword}
    })

    await db.passwordResetToken.delete({
        where: {id: existingToken.id},

    })

    return { success: "Senha alterada com sucesso!" }
}