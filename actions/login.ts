"use server"

import {signIn} from "@/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/mail"
import {DEFAULT_LOGIN_REDIRECT} from "@/routes"
import {LoginSchema} from "@/schemas"
import {AuthError} from "next-auth"
import * as z from "zod"

export const login = async(values : z.infer < typeof LoginSchema >) => {
    const validadeFields = LoginSchema.safeParse(values)

    if (!validadeFields.success) {
        return {error: "Credenciais inválidas!"}
    }

    const {email, password} = validadeFields.data
    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Email não cadastrado!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: "Codigo de verificação enviado para o seu email!"}
    }

    try {
        await signIn("credentials", {
            email, 
            password, 
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Credenciais inválidas"}
                default:
                    return {error: "Erro desconhecido"}
            }
        }

        throw error
    }
}