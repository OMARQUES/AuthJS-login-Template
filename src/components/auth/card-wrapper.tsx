'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card"
import { Header } from "@/src/components/auth/header"
import { Social } from "@/src/components/auth/social"
import { BackButton } from "@/src/components/auth/back-button"

interface CardWrapperProps {
    children: React.ReactNode,
    headerTitle: string,
    headerLabel: string,
    backButtonLabel: string,   
    backButtonHref: string,
    showSocial?: boolean
}

export const CardWrapper = ({
    children,
    headerTitle,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial
} : CardWrapperProps) => {
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} title={headerTitle}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && ( 
                <CardFooter>
                    <Social/>
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref}/>
            </CardFooter>
        </Card>
    )
}