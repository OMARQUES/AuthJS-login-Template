import { db } from "@/lib/db"
import { TwoFactorToken } from "@prisma/client"

export const createTwoFactorToken = async (
    email: string,
    token: string,
    expires: Date
) => {
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return twoFactorToken
}

export const getTwoFactorTokenByToken = async (
    token: string
) => {
    try{
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: {token}
        })

        return twoFactorToken
    }catch{
        return null
    }
}

export const getTwoFactorTokenByEmail = async (
    email: string
) => {
    try{
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {email}
        })

        return twoFactorToken
    }catch{
        return null
    }
}

export const createPasswordResetToken = async (
    email: string,
    token: string,
    expires: Date
) => {
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}

export const deletePasswordResetToken = async (
    existingToken: TwoFactorToken
) => {
    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    })
}

export const deleteTwoFactorToken = async (
    twoFactorToken : TwoFactorToken
) => {
    try{
        await db.twoFactorToken.delete({
            where: {id: twoFactorToken.id}
        })

        return true
    }catch{
        return false
    }
}
