"use server"

import { signOut } from "@/src/auth"
import { PATH } from "@/src/utils/constants"

export const logout = async (path?: string) => {
    await signOut({ redirectTo: path || PATH.LOGIN_PATH })
}