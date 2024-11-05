'use client'

import { useForm } from "react-hook-form"
import {CardWrapper} from "./card-wrapper"
import { LoginSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { login } from "@/actions/login"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

export const LoginForm = () => {
    const searchParams = useSearchParams()
    //Verifica se a conta já foi vinculada a outro provedor usando o link de erro da url
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
    ? "Email já cadastrado, tente fazer login de outra forma" 
    : ""

    
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(values)
            .then((data) => {
                setError(data?.error)
                setSuccess(data?.success)
            })
        })
    }
    return (
        <CardWrapper
            headerLabel="Bem Vindo"
            backButtonLabel="Não possui uma conta?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        {...field}
                                        placeholder="Email"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="password" render={({ field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        {...field}
                                        placeholder="******"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>

                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
