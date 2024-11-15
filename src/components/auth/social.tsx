'use client'

import {signIn} from "next-auth/react"
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"

import {Button} from "@/src/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/src/routes"
import { useSearchParams } from "next/navigation"

export const Social = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    const onClick = async (provider: "google" | "github") => {
        signIn(provider,{
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    }
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button size='lg' variant='outline' className="w-full" onClick={() => onClick("google")}>
                <FcGoogle className="w-5 h-5"/>
            </Button>
            <Button size='lg' variant='outline' className="w-full" onClick={() => onClick("github")}>
                <FaGithub className="w-5 h-5"/>
            </Button>
        </div>
    )
} 