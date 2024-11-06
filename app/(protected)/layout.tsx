import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "./_components/navbar"

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default async function ProtectedLayout(
    {children}:ProtectedLayoutProps
){
    const session = await auth()
    
    return (
        <SessionProvider session={session}>
            <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-300 to-green-800">
                <Navbar/>
                {children}
            </div>
        </SessionProvider>
    )
}