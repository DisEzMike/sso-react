import './style.css';
import { useEffect, useState } from "react";
import { getUser } from "../../function/user";
import { useNavigate } from "react-router-dom";
import { AUTH_URL, HOST } from '../../utils/contant';

function UserProfile() {
    const [user, setUser] = useState("");
    const [token, setToken] = useState({} as any);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            const token = JSON.parse(localStorage.getItem('token')!);
            setToken(token);
            loadProfile();
        }
        else navigate('/')
    }, []);

    const loadProfile = async () => {
        const user = await getUser();
        if (user) {
            localStorage.setItem('user_id', user.data.sub as string);
            setUser(JSON.stringify(user.data));
        }
  }
    return ( 
        <>
        <pre>
            {user}
        </pre>
        <button 
        onClick={() => window.location.href = AUTH_URL+`/logout?id_token_hint=${token.id_token}`}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span 
            className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Logout
            </span>
        </button>
        </>
     );
}

export default UserProfile;