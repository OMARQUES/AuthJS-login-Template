import {db} from "@/src/lib/db"

export const createUser = async (data: { [key: string]: any }) => {
    await db.user.create({
        data: {
            ...data
        }
    })
}
export const getUserByEmail = async (email: string) => {
    try{
        const user = await db.user.findUnique({
            where: {email}
        })
        return user
    }catch(e){
        return null
    }
}

export const getUserByID = async (id: string) => {
    try{
        const user = await db.user.findUnique({
            where: {id}
        })
        return user
    }catch(e){
        return null
    }
}

export const updateUserByID = async (
    userId: string,
    data: { [key: string]: any }
) => {

    return await db.user.update({
        where: {
            id: userId
        },
        data: {
            ...data,
        }
    })
}