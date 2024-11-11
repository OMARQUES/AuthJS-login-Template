"use client"

import * as z from "zod"
import { settings } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } 
from "@/components/ui/card"
import { GearIcon } from "@radix-ui/react-icons"
import { signOut, useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { SettingsSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@prisma/client"
import { Switch } from "@/components/ui/switch"
import { logout } from "@/actions/logout"

const SettingsPage = () => {

    const user = useCurrentUser()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        }
    })

    const { update } = useSession()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        setError(undefined)
        setSuccess(undefined)
        
        startTransition(() => {
            settings(values)    
            .then(async (data) => {
                if(data.success === "Email de verificação enviado!"){
                    await logout("/auth/login?emailSend=true")
                    return
                }
                if(data.error){
                    setError(data.error)
                }
                if(data.success){
                    update()
                    setSuccess(data.success)
                }
            })   
            .catch(() => setError("Erro ao atualizar configurações!"))     
        })
    }

    return (
        <Card className="w-[450px]">
            <CardHeader>
                <div className="text-2xl font-semibold flex justify-center items-center">
                    <GearIcon className="w-6 h-6 mr-2"/>
                    Configurações
                </div>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form 
                        className="space-y-4" 
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Nome"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {user?.isOAuth === false && (<>
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder="exemplo@mail.com"
                                                    type="email"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder="******"
                                                    type="password"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="newPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nova Senha</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder="******"
                                                    type="password"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>)}    

                            <FormField 
                                control={form.control}
                                name="role"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Função</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Escolha a função"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>
                                                    Administrador
                                                </SelectItem>
                                                <SelectItem value={UserRole.USER}>
                                                    Usuario
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {user?.isOAuth === false && (
                                <FormField 
                                    control={form.control}
                                    name="isTwoFactorEnabled"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Autenticação de dois fatores</FormLabel>
                                                <FormDescription>
                                                    Ative a autenticação de dois fatores para aumentar a segurança da sua conta.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    disabled={isPending}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}

                        </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button 
                            disabled={isPending}
                            type="submit">
                            Salvar
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingsPage