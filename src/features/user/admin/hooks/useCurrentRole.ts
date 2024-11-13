import { useSession } from "next-auth/react"

//User em client pages

export const useCurrentRole = () => {
    const session = useSession()
    return session.data?.user?.role
}