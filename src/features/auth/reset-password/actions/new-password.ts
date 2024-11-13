"use server"

import { getPasswordResetTokenByToken } from "@/src/data/passwordVerificationToken"
import { getUserByEmail, updateUserByID } from "@/src/data/user"
import { NewPasswordSchema } from "../schemas"
import * as z from "zod"
import bcryps from "bcryptjs"
import { deletePasswordResetTokenWithUserId } from "@/src/data/twoFactorToken"
import { ERROR, SUCCESS } from "@/src/utils/constants"

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if(!token) {
        return { error: ERROR.TOKEN_NOT_FOUND }
    }

    const validatedFields = NewPasswordSchema.safeParse(values)

    if(!validatedFields.success) {
        return { error: ERROR.VALIDATION_ERROR }
    }

    const { password } = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return { error: ERROR.INVALID_TOKEN }
    }

    const hasExperided = new Date(existingToken.expires) < new Date()

    if(hasExperided) {
        return { error: ERROR.TOKEN_EXPIRED }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser) {
        return { error: ERROR.EMAIL_NOT_REGISTERED }
    }

    const hashedPassword = await bcryps.hash(password, 10)

    await updateUserByID(existingUser.id, {password: hashedPassword})

    deletePasswordResetTokenWithUserId(existingToken)

    return { success: SUCCESS.PASSWORD_CHANGED }
}