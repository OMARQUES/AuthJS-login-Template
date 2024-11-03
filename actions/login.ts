"use server"

import { LoginSchema } from "@/schemas"
import * as z from "zod"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validadeFields = LoginSchema.safeParse(values)

    if(!validadeFields.success) {
        return {error: "Credenciais inválidas"}
    }

    return {success: "Email enviado!"}
}