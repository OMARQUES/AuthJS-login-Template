"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"

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

    //Todo: Enviar email com token de verificação

    return {success: "Usuario criado!"}
}