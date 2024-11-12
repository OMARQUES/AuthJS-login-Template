'use client'

import { useForm } from "react-hook-form"
import {CardWrapper} from "./card-wrapper"
import { RegisterSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { register } from "@/actions/register"
import { useState, useTransition } from "react"
import { PATH } from "../../utils/constants"

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            register(values)
            .then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
        })
    }
    return (
        <CardWrapper
            headerLabel="Criar conta"
            backButtonLabel="Já possui uma conta?"
            backButtonHref={PATH.LOGIN_PATH}
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
                        <FormField control={form.control} name="name" render={({ field}) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        {...field}
                                        placeholder="Name"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>

                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isPending}
                    >
                        Criar Conta
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
