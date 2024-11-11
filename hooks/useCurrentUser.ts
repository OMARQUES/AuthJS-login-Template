import { useSession } from "next-auth/react"

//User em client pages

export const useCurrentUser = () => {
    const session = useSession()
    return session.data?.user
}