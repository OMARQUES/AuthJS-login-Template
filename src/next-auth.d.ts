import { UserRole } from "@prisma/client"
import NextAuth, {type DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    id: string
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
}

declare module "next-Auth" {
  interface Session{
    user: ExtendedUser
  }
}