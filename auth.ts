import NextAuth, {type DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import authConfig from "./auth.config"

import {db} from "@/lib/db"
import { getUserByID } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/twoFactorConfirmation"

declare module "@auth/core" {
  interface Session{
    user:{
      role: "ADMIN" | "USER"
    }& DefaultSession["user"]
  }
}

const prisma = new PrismaClient()
 
export const { auth, handlers, signIn, signOut 

} = NextAuth({
  pages:{
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({user}){
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    async signIn({user, account}){
      //Permitir Oauth sem verificação de email
      if(account?.provider !== "credentials") return true

      if(!user.id) return false

      const existingUser = await getUserByID(user.id)

      if(!existingUser?.emailVerified) return false

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await 
        getTwoFactorConfirmationByUserId(existingUser.id)

        if(!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }           
        })
      }

      return true
    },
    async session({token, session}) {
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(token.role && session.user){
        session.user.role = token.role as UserRole
      }
      return session
    },
    async jwt({token}) {
      if(!token.sub) return token

      const existingUser = await getUserByID(token.sub)

      if(!existingUser) return token

      token.role = existingUser.role

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})