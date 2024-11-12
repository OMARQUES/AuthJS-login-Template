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
import { createTwoFactorConfirmationWithUserId, deleteTwoFactorConfirmationByTokenId, getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation"
import { deleteTwoFactorTokenByTokenId, getTwoFactorTokenByToken } from "@/data/twoFactorToken"
import { getAccountByUserId } from "@/data/account"
import { ERROR, SUCCESS } from "@/utils/constants"

export const login = async(
    values : z.infer < typeof LoginSchema >,
    callbackUrl?: string | null,
    showTwoFactor?: boolean
) => {
    const validadeFields = LoginSchema.safeParse(values)

    if (!validadeFields.success) {
        return {error: ERROR.INVALID_CREDENTIALS}
    }

    const {email, password, code} = validadeFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: ERROR.EMAIL_NOT_REGISTERED}
    }
    
    if (existingUser){
        const isOAuth = await getAccountByUserId(existingUser.id)
        if(isOAuth){
            return {error: ERROR.EMAIL_LINKED_TO_OAUTH}
        }
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password)
    if(!passwordMatch){
        return {error: ERROR.INVALID_CREDENTIALS}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email)
        if(!verificationToken){
            return {error: ERROR.GENERATING_VERIFICATION_CODE}
        }
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {success: SUCCESS.VERIFICATION_TOKEN_SENT}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(!code && showTwoFactor){
            return {error: ERROR.TWO_FACTOR_CODE_REQUIRED}           
        }

        if(code){

            const twoFactorToken = await getTwoFactorTokenByToken(code)

            if(!twoFactorToken){
                return {error: ERROR.TWO_FACTOR_CODE_INVALID}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if(hasExpired){            
                await deleteTwoFactorTokenByTokenId(twoFactorToken)    
                return {error: ERROR.TWO_FACTOR_CODE_EXPIRED}
            }

            await deleteTwoFactorTokenByTokenId(twoFactorToken)

            const existingConfirmation = await 
            getTwoFactorConfirmationByUserId(existingUser.id)

            if(existingConfirmation) await deleteTwoFactorConfirmationByTokenId(existingConfirmation.id)

            await createTwoFactorConfirmationWithUserId(existingUser.id)
            
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
                    return {error: ERROR.INVALID_CREDENTIALS}
                default:
                    return {error: ERROR.UNKNOWN_ERROR}
            }
        }

        throw error
    }
}