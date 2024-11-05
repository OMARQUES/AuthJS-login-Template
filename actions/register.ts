"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/data/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validadeFields = RegisterSchema.safeParse(values)

    if(!validadeFields.success) {
        return {error: "Credenciais inválidas"}
    }

    const { email, password, name } = validadeFields.data;
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)
    if(existingUser) {
        return {error: "Email já está em uso!"}
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {success: "Codigo de verificação enviado para o seu email!"}
}