import * as z from 'zod'

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {message: "Minimo de 6 caracteres"}),
}) 

export const ResetSchema = z.object({
    email: z.string().email({message: "Email invalido"})
        .transform(email => email.trim().toLowerCase()),
})