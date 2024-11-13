"use server"

import { getAccountByUserId } from "@/src/data/account"
import { getUserByEmail } from "@/src/data/user"
import { sendPasswordResetEmail } from "../lib/mail"
import { generatePasswordResetToken } from "../lib/tokens"
import { ResetSchema } from "../schemas"
import { ERROR, SUCCESS } from "@/src/utils/constants"
import * as z from "zod"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validadedFields = ResetSchema.safeParse(values)

    if(!validadedFields.success){
        return {error: ERROR.INVALID_EMAIL}
    }

    const { email } = validadedFields.data

    const existingUser = await getUserByEmail(email)    

    if(!existingUser){
        return {error: ERROR.EMAIL_NOT_REGISTERED}
    }

    const isOAuth = await getAccountByUserId(existingUser.id)

    if(isOAuth){
        return {error: ERROR.EMAIL_LINKED_TO_OAUTH}
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return {success: SUCCESS.PASSWORD_RESET_EMAIL_SENT}
}