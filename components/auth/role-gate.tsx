"use client"

import { useCurrentRole } from "@/hooks/useCurrentRole"
import { UserRole } from "@prisma/client"
import { FormError } from "../form-error"
import { ERROR } from "../../utils/constants"

interface RoleGateProps {
    children: React.ReactNode,
    allowedRoles: UserRole
}

export const RoleGate = ({ 
    children, 
    allowedRoles 
}: RoleGateProps
) => {
    const role = useCurrentRole()

    if (role !== allowedRoles) {
        return (
            <FormError message={ERROR.PERMISSION_DENIED}/>
        )
    }

    return(
        <>
            {children}
        </>
    )
}