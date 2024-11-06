"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    //Executar funções do server antes do logOut
    await signOut({redirectTo: "/auth/login"})
}