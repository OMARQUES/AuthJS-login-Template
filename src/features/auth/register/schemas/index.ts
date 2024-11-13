import * as z from 'zod'

export const RegisterSchema = z.object({
    email: z.string().email({message: "Email invalido"})
        .transform(email => email.trim().toLowerCase()), 
    password: z.string().min(6, {message: "Minimo de 6 caracteres"}),
    name: z.string().min(3, {message: "Escolha um nome valido"})
}) 
