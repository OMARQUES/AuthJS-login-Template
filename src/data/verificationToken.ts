import { db } from "@/src/lib/db"
import { VerificationToken } from "@prisma/client"

export const createVerificationToken = async (
    email: string,
    token: string,
    expires: Date
) => {
    try{
        const verificationToken = await db.verificationToken.create({
            data: {
                email,
                token,
                expires
            }
        })
        return verificationToken
    }
    catch{
        return null
    }
}

export const deleteVerificationTokenByTokenID = async (
    existingToken: VerificationToken
) => {
    try{
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    catch{
        return null
    }
}

export const getVerificationTokenByEmail = async (
    email : string
) => {
    try{
        const verificationToken = await db.verificationToken.findFirst({
            where: {email}
        })
        return verificationToken
    }
    catch{
        return null
    }
}

export const getVerificationTokenByToken = async (
    token : string
) => {
    try{
        const verificationToken = await db.verificationToken.findUnique({
            where: {token}
        })
        return verificationToken
    }
    catch{
        return null
    }
}