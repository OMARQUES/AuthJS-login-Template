"use client"

import * as z from "zod"
import { settings } from "@/src/features/user/settings/action/settings"
import { Button } from "@/src/components/ui/button"
import { Card, CardHeader, CardContent } from "@/src/components/ui/card"
import { GearIcon } from "@radix-ui/react-icons"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { SettingsSchema } from "@/src/features/auth/register/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { useCurrentUser } from "@/src/hooks/useCurrentUser"
import { FormError } from "@/src/components/auth/form-error"
import { FormSuccess } from "@/src/components/auth/form-success"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { UserRole } from "@prisma/client"
import { Switch } from "@/src/components/ui/switch"
import { logout } from "@/src/actions/logout"
import { ERROR, PATH } from "@/src/utils/constants"

const SettingsCard = () => {

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
                if(data.emailHasChanged){
                    await logout(`${PATH.LOGIN_PATH}?emailSend=true`)
                    return
                }
                if(data.error){
                    setError(data.error)
                }
                if(data.success){
                    update()
                    //TODO: Reset password fields
                    setSuccess(data.success)
                }            
            })   
            .catch(() => setError(ERROR.SETTINGS_UPDATE_ERROR))     
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

export default SettingsCard