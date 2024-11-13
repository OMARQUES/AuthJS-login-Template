'use client'

import { useForm } from "react-hook-form"
import {CardWrapper} from "@/src/components/auth/card-wrapper"
import { LoginSchema } from "../schemas" 
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { FormError } from "@/src/components/auth/form-error"
import { FormSuccess } from "@/src/components/auth/form-success"
import { login } from "@/src/features/auth/login/actions/login"
import { useEffect, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { ERROR, SUCCESS, PATH } from "@/src/utils/constants"
import Link from "next/link"

export const LoginForm = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    const [showTwoFactor, setShowTwoFactor] = useState(false)
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

    useEffect(() => {
        //Verifica se a conta já foi vinculada a outro provedor usando o link de erro da url
        if (searchParams.get("error") === "OAuthAccountNotLinked") {
            setError(ERROR.OAUTH_ACCOUNT_NOT_LINKED)
        }

        //Email de verificação foi enviado
        if (searchParams.get("emailSend") === "true") {
            setSuccess(SUCCESS.EMAIL_VERIFICATION_SENT)
        }
    }, [searchParams])


    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(values, callbackUrl, showTwoFactor)
            .then((data) => {                
                if(data?.error == ERROR.TWO_FACTOR_CODE_REQUIRED){                    
                    setError(data.error)
                    return
                }
                if(data?.error == ERROR.TWO_FACTOR_CODE_INVALID){                    
                    setError(data.error)
                    return
                }
                if(data?.error == ERROR.TWO_FACTOR_CODE_EXPIRED){                    
                    setShowTwoFactor(false)
                    form.reset()                    
                    setError(data.error)
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
                }
            })
            .catch(() => setError(ERROR.UNKNOWN_ERROR))
        })
    }
    return (
        <CardWrapper
            headerTitle="Login"
            headerLabel="Bem Vindo"
            backButtonLabel="Não possui uma conta?"
            backButtonHref={PATH.REGISTER_PATH}
            showSocial
        >
            <Form {...form}>
                <form onChange={() => { setError(""); setSuccess(""); }} 
                onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                            <Link href={PATH.RESET_PASSWORD_PATH}>
                                                Esqueceu a sua senha?
                                            </Link>
                                        </Button>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            </>
                        )}
                    </div>

                    <FormError message={error}/>
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
