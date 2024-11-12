"use server"

import { currentRole } from "@/lib/auth"
import { ERROR, SUCCESS } from "@/utils/constants"
import { UserRole } from "@prisma/client"

export const admin = async () => {
    const role = await currentRole()

    if (role === UserRole.ADMIN) {
        return {success: SUCCESS.SERVER_ACTION}
    }

    return {error: ERROR.SERVER_ACTION}
}