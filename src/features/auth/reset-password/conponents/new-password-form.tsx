'use client'

import { useForm } from "react-hook-form"
import { CardWrapper }  from "@/src/components/auth/card-wrapper"
import { NewPasswordSchema } from "../schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { FormError } from "@/src/components/auth/form-error"
import { FormSuccess } from "@/src/components/auth/form-success"
import { newPassword } from "@/src/features/auth/reset-password/actions/new-password"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { PATH } from "@/src/utils/constants"


export const NewPasswordForm = () => {

    const searchParam = useSearchParams()
    const token = searchParam.get("token")
    
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")
        
        startTransition(() => {
            newPassword(values, token)
            .then((data) => {
                setError(data?.error)
                setSuccess(data?.success)
            })
        })
    }
    return (
        <CardWrapper
            headerTitle="Nova senha"
            headerLabel="Vamos alterar a sua senha"
            backButtonLabel="Fazer Login"
            backButtonHref={PATH.LOGIN_PATH}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="password" render={({ field}) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        {...field}
                                        placeholder="Escolha uma senha"
                                        type="password"
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
                        Redefinir Senha
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
