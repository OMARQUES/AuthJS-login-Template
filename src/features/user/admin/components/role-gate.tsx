"use client"

import { useCurrentRole } from "@/src/features/user/admin/hooks/useCurrentRole"
import { UserRole } from "@prisma/client"
import { FormError } from "../../../../components/auth/form-error"
import { ERROR } from "../../../../utils/constants"

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