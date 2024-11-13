import { db } from "@/src/lib/db"

export const createTwoFactorConfirmationWithUserId = async (
    userId: string
) => {
    try{
        await db.twoFactorConfirmation.create({
            data: {
                userId: userId
            }
        })

        return true

    }catch{
        return null
    }
}

export const getTwoFactorConfirmationByUserId = async (
    userId: string
) => {
    try{
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {userId}
        })

        return twoFactorConfirmation

    }catch{
        return null
    }
}

export const deleteTwoFactorConfirmationByTokenId = async (
    twoFactorConfirmationID: string
) => {
    try{
        await db.twoFactorConfirmation.delete({
            where: {id: twoFactorConfirmationID}
        })

        return true

    }catch{
        return false
    }
}