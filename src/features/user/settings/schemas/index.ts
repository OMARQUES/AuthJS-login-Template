import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const SettingsSchema = z.object({
    name: z.optional(z.string().min(3, {message: "Escolha um nome valido"})),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email({message: "Email invalido"}))
        .transform(email => email ? email.trim().toLowerCase(): undefined),
    password: z.optional(z.string().min(6, {message: "Minimo de 6 caracteres"})),
    newPassword: z.optional(z.string().min(6, {message: "Minimo de 6 caracteres"})),
})
    .refine((data) => {
        if(data.password && !data.newPassword){
            return false
        }

        return true
    },{
        message: "Nova senha é obrigatória!",
        path: ["newPassword"]
    })
    .refine((data) => {
        if(data.newPassword && !data.password){
            return false
        }

        return true
    },{
        message: "Senha atual é obrigatória!",
        path: ["password"]
    })