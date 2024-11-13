"use client"

import { UserInfo } from "@/src/components/userInfo";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

const ClientPage = () => {

    const user = useCurrentUser()

    return ( 
        <UserInfo 
            user={user}
            label="Client component"
        />
    );
}

export default ClientPage;