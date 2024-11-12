'use client'

import { useForm } from "react-hook-form"
import {CardWrapper} from "./card-wrapper"
import { NewPasswordSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { newPassword } from "@/actions/new-password"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { PATH } from "../../utils/constants"


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
            headerLabel="Escolha uma nova senha"
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
