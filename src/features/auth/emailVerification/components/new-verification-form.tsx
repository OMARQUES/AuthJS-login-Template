"use client"

import { newVerification } from "@/src/features/auth/emailVerification/actions/new-verification"
import { CardWrapper } from "@/src/components/auth/card-wrapper"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"
import { BeatLoader } from "react-spinners"
import { FormSuccess } from "@/src/components/auth/form-success"
import { FormError } from "@/src/components/auth/form-error"
import { ERROR, SUCCESS, PATH } from "@/src/utils/constants"


export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const useEffectCalled = useRef(false)

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if(success || error) return

        if (!token) {
            setError(ERROR.INVALID_TOKEN)
            return
        }

        newVerification(token)
        .then((data) => {
            setSuccess(data.success)
            setError(data.error)
        })
        .catch(()=>{
            setError(ERROR.UNKNOWN_ERROR)
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
        headerTitle="......"
        headerLabel="Confirmando seu email"
        backButtonHref={PATH.LOGIN_PATH}
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