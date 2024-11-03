import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({message: "Email invalido"}), 
    password: z.string().min(1, {message: "Senha invalida"})
}) 

export const RegisterSchema = z.object({
    email: z.string().email({message: "Email invalido"}), 
    password: z.string().min(6, {message: "Minimo de 6 caracteres"}),
    name: z.string().min(1, {message: "Nome invalido"})

}) 
