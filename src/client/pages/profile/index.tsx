import { useEffect, useState } from "react";
import { getUser } from "../../function/user";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('token')) loadProfile();
        else navigate('/')
    }, []);

    const loadProfile = async () => {
        const user = await getUser();
        if (user) {
            console.log(user)
            localStorage.setItem('user_id', user.data.sub);
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