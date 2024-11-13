'use client'

import { useForm } from "react-hook-form"
import {CardWrapper} from "@/src/components/auth/card-wrapper"
import { ResetSchema } from "../schemas" 
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { FormError } from "@/src/components/auth/form-error"
import { FormSuccess } from "@/src/components/auth/form-success"
import { reset } from "@/src/features/auth/reset-password/actions/reset"
import { useState, useTransition } from "react"
import { PATH } from "@/src/utils/constants"

export const ResetForm = () => {
    
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")
        
        startTransition(() => {
            reset(values)
            .then((data) => {
                setError(data?.error)
                setSuccess(data?.success)
            })
        })
    }
    return (
        <CardWrapper
            headerTitle="Esqueceu a senha?"
            headerLabel="Vamos recuperar a sua senha"
            backButtonLabel="Fazer Login"
            backButtonHref={PATH.LOGIN_PATH}
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
                    </div>

                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isPending}
                    >
                        Enviar email de recuperação
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
