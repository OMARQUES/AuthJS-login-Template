import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({message: "Email invalido"})
        .transform(email => email.trim().toLowerCase()),
    password: z.string().min(1, {message: "Senha invalida"}),
    code: z.optional(z.string())
})