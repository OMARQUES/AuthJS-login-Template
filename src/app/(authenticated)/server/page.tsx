import { UserInfo } from "@/src/components/auth/userInfo";
import { currentUser } from "@/src/lib/auth";

const ServerPage = async () => {

    const user = await currentUser()

    return ( 
        <UserInfo 
            user={user}
            label="Server component"
        />
    );
}

export default ServerPage;