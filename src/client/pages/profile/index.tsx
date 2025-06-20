import { useEffect, useState } from "react";
import { getUser } from "../../function/user";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) loadProfile();
        else navigate('/')
    }, []);

    const loadProfile = async () => {
        const user = await getUser();
        if (user) {
            setUser(JSON.stringify(user.data));
        }
  }
    return ( 
        <>
        <pre>
            {user}
        </pre>
        </>
     );
}

export default UserProfile;