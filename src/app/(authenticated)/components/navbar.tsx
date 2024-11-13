"use client"

import { UserButton } from "@/src/components/auth/user-button"
import { Button } from "@/src/components/ui/button"
import { PATH } from "@/src/utils/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Navbar = () => {
    const pathname = usePathname()

    return (
        <nav className="bg-secondary flex  justify-between items-center p-2 rounded-xl w-[450px] shadow-sm">
            <div className="flex gap-x-2">
                <Button 
                    asChild 
                    variant={pathname === PATH.ADMIN_PATH ? "default" : "outline"}>
                    <Link href={PATH.ADMIN_PATH}>
                        Admin
                    </Link>
                </Button>

                <Button 
                    asChild 
                    variant={pathname === PATH.CLIENT_PATH ? "default" : "outline"}>
                    <Link href={PATH.CLIENT_PATH}>
                        Client
                    </Link>
                </Button>

                <Button 
                    asChild 
                    variant={pathname === PATH.SERVER_PATH ? "default" : "outline"}>
                    <Link href={PATH.SERVER_PATH}>
                        Server
                    </Link>
                </Button>

                <Button 
                    asChild 
                    variant={pathname === PATH.SETTINGS_PATH ? "default" : "outline"}>
                    <Link href={PATH.SETTINGS_PATH}>
                        Settings
                    </Link>
                </Button>
            </div>
            <UserButton/>
        </nav>
    )
}