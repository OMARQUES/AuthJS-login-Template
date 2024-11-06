"use server"

import {signIn} from "@/auth"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail } from "@/data/user"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import {DEFAULT_LOGIN_REDIRECT} from "@/routes"
import {LoginSchema} from "@/schemas"
import {AuthError} from "next-auth"
import * as z from "zod"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation"
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken"

export const login = async(values : z.infer < typeof LoginSchema >) => {
    const validadeFields = LoginSchema.safeParse(values)

    if (!validadeFields.success) {
        return {error: "Credenciais inválidas!"}
    }

    const {email, password, code} = validadeFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Email não cadastrado!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: "Codigo de verificação enviado para o seu email!"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            console.log(twoFactorToken)
            
            if(!twoFactorToken){
                return {error: "Codigo de verificação inválido!"}
            }

            if(twoFactorToken.token !== code){
                return {error: "Codigo de verificação inválido!"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if(hasExpired){
                return {error: "Codigo de verificação expirado!"}
            }

            await db.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            })

            const existingConfirmation = await 
            getTwoFactorConfirmationByUserId(existingUser.id)

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {id: existingConfirmation.id}
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
            
        }else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token)
            return {twoFactor: true}
        }
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