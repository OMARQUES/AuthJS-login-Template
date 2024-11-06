import * as z from 'zod'

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {message: "Minimo de 6 caracteres"}),
}) 

export const ResetSchema = z.object({
    email: z.string().email({message: "Email invalido"})
}) 

export const LoginSchema = z.object({
    email: z.string().email({message: "Email invalido"}), 
    password: z.string().min(1, {message: "Senha invalida"}),
    code: z.optional(z.string())
}) 

export const RegisterSchema = z.object({
    email: z.string().email({message: "Email invalido"}), 
    password: z.string().min(6, {message: "Minimo de 6 caracteres"}),
    name: z.string().min(1, {message: "Nome invalido"})

}) 
