"use server"

import { getUserByEmail, updateUserByID } from "@/src/data/user"
import { deleteVerificationTokenByTokenID, getVerificationTokenByToken } from "@/src/data/verificationToken"
import { ERROR, SUCCESS } from "@/src/utils/constants"

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)
    if (!existingToken) {
        return {error: ERROR.TOKEN_NOT_FOUND}
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return {error: ERROR.TOKEN_EXPIRED}
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        return {error: ERROR.EMAIL_NOT_REGISTERED}
    }

    const updateUser = await updateUserByID(
        existingUser.id, 
        {
            emailVerified: new Date(), 
            email: existingToken.email
        })

    if(!updateUser) return {error: ERROR.EMAIL_VERIFICATION_ERROR}

    await deleteVerificationTokenByTokenID(existingToken)

    return {success: SUCCESS.EMAIL_VERIFIED}
}