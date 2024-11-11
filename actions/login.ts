"use server"

import {signIn} from "@/auth"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail } from "@/data/user"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import {DEFAULT_LOGIN_REDIRECT} from "@/routes"
import {LoginSchema} from "@/schemas"
import {AuthError} from "next-auth"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation"
import { deleteTwoFactorToken, getTwoFactorTokenByToken } from "@/data/twoFactorToken"
import { getAccountByUserId } from "@/data/account"

export const login = async(
    values : z.infer < typeof LoginSchema >,
    callbackUrl?: string | null,
    showTwoFactor?: boolean
) => {
    const validadeFields = LoginSchema.safeParse(values)

    if (!validadeFields.success) {
        return {error: "Credenciais inválidas!"}
    }

    const {email, password, code} = validadeFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Email não cadastrado!"}
    }
    
    if (existingUser){
        const isOAuth = await getAccountByUserId(existingUser.id)
        if(isOAuth){
            return {error: "Email vinculado a uma rede social!"}
        }
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password)
    if(!passwordMatch){
        return {error: "Credenciais inválidas!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email)
        if(!verificationToken){
            return {error: "Erro ao gerar o codigo de verificação!"}
        }
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: "Codigo de verificação enviado para o seu email!"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(!code && showTwoFactor){
            return {error: "Insira o codigo de verificação!"}           
        }

        if(code){

            const twoFactorToken = await getTwoFactorTokenByToken(code)

            if(!twoFactorToken){
                return {error: "Codigo de verificação inválido!"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if(hasExpired){            
                await deleteTwoFactorToken(twoFactorToken)    
                return {error: "Codigo de verificação expirado!"}
            }

            await deleteTwoFactorToken(twoFactorToken)

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
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
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