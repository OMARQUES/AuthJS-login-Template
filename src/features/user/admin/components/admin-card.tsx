"use client"

import { admin } from "@/src/features/user/admin/actions/admin"
import { RoleGate } from "@/src/features/user/admin/components/role-gate"
import { FormSuccess } from "@/src/components/auth/form-success"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
import { ERROR, PATH, SUCCESS } from "@/src/utils/constants"

export const AdminCard = () => {

    const onServerActionClick = async () => {
        admin()
        .then((data) => {
            if(data.error){
                toast.error(data.error)
            }

            if(data.success){
                toast.success(data.success)
            }
        }
    )}    

    const onApiRouteClick = async () => {
        fetch(PATH.API_ADMIN_URL)
        .then((response) => {
            if (response.ok) {
                toast.success(SUCCESS.SERVER_ACTION)
            } else {
                toast.error(ERROR.SERVER_ACTION)
            }
        })
    }

    return (
        <Card className="w-[450px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRoles={UserRole.ADMIN}>
                    <FormSuccess message="Você tem autorização para ver esse conteudo"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin Only - API Route
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Test
                    </Button>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin Only - Server Action
                    </p>
                    <Button onClick={onServerActionClick}>
                        Test
                    </Button>
                </div>
            </CardContent>            
        </Card>
    )
}

export default AdminCard