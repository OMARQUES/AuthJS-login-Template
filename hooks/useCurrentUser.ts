import { useSession } from "next-auth/react"

//Use em client pages

export const useCurrentUser = () => {
    const session = useSession()
    return session.data?.user
}