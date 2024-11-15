import { auth } from "@/src/auth"

//Usar em server pages

export const currentUser = async () => {
    const session = await auth()

    return session?.user
}

export const currentRole = async () => {
    const session = await auth()

    return session?.user?.role
}