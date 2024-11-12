"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { ERROR, SUCCESS } from "@/utils/constants"
import { RegisterSchema } from "@/schemas"
import { createUser, getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validadeFields = RegisterSchema.safeParse(values)

    if(!validadeFields.success) {
        return {error: ERROR.INVALID_CREDENTIALS}
    }

    const { email, password, name } = validadeFields.data;
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)
    if(existingUser) {
        return {error: ERROR.EMAIL_IN_USE}
    }

    await createUser({name, email, password: hashedPassword})

    const verificationToken = await generateVerificationToken(email)

    if(!verificationToken) {
        return {error: ERROR.GENERATING_VERIFICATION_CODE}
    }
    
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {success: SUCCESS.VERIFICATION_TOKEN_SENT}
}