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
import Link from "next/link"

export const LoginForm = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    //Verifica se a conta já foi vinculada a outro provedor usando o link de erro da url
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
    ? "Email já cadastrado, tente fazer login de outra forma" 
    : ""

    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [expectingCode, setExpectingCode] = useState(false)
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
            login(values, callbackUrl, expectingCode)
            .then((data) => {
                if(data?.error == "Codigo de verificação inválido!"){                    
                    setError(data.error)
                    return
                }
                if(data?.error == "Insira o codigo de verificação!"){                    
                    setError(data.error)
                    return
                }
                if(data?.error){
                    setShowTwoFactor(false)
                    form.reset()
                    setError(data.error)
                }
                if(data?.success){
                    form.reset()
                    setSuccess(data.success)
                }
                if(data?.twoFactor){
                    setShowTwoFactor(true)
                    setExpectingCode(true)
                }
            })
            .catch(() => setError("Algo deu errado!"))
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
                        {showTwoFactor && (
                            <FormField control={form.control} name="code" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Codigo de verificação</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            placeholder="123456"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        )}
                        {!showTwoFactor && (
                            <>
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
                                                placeholder="Escolha uma senha"
                                                type="password"
                                            />
                                        </FormControl>
                                        <Button 
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                        >
                                            <Link href="/auth/reset">
                                                Esqueceu a sua senha?
                                            </Link>
                                        </Button>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            </>
                        )}
                    </div>

                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button 
                        disabled={isPending}
                        type="submit" 
                        className="w-full">
                        {showTwoFactor ? "Confirmar" : "Entrar"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
