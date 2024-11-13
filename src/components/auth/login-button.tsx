'use client'

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { LoginForm } from "../../features/auth/login/components/login-form"
import { PATH } from "../../utils/constants"

interface LoginButtonProps {
    children : React.ReactNode,
    modal?: boolean,
    asChild?: boolean
}

export const LoginButton = ({
    children,
    modal,
    asChild 
} : LoginButtonProps) => {
    const router = useRouter()
    
    const onClick = () => {
        router.push(PATH.LOGIN_PATH)
    }

    if(modal){
        return(
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <LoginForm/>
                </DialogContent>
            </Dialog>
        )
    }

    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}