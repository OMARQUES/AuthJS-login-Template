"use client"

import { newVerification } from "@/actions/new-verification"
import { CardWrapper } from "./card-wrapper"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"
import { BeatLoader } from "react-spinners"
import { set } from "zod"
import { FormSuccess } from "../form-success"
import { FormError } from "../form-error"

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const useEffectCalled = useRef(false)

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if(success || error) return

        if (!token) {
            setError("Token inválido!")
            return
        }

        newVerification(token)
        .then((data) => {
            setSuccess(data.success)
            setError(data.error)
        })
        .catch(()=>{
            setError("Algo deu errado!")
        })
    }, [token, success, error])

    useEffect(() => {
        if(!useEffectCalled.current){
            useEffectCalled.current = true
            onSubmit()
        }
    }, [onSubmit])

    return(
        <CardWrapper 
        headerLabel="Confirmando seu email..."
        backButtonHref="/auth/login"
        backButtonLabel="Fazer Login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader/>
                )}
                <FormSuccess message={success}/>
                {!success && (
                    <FormError message={error}/>
                )}
            </div>
        </CardWrapper>
    )
}