"use server"

import { signOut } from "@/auth"
import { DEFAULT_LOGIN_PATH } from "@/routes"

export const logout = async (path?: string) => {
    await signOut({ redirectTo: path || DEFAULT_LOGIN_PATH })
}