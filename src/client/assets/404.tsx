import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function NotFound() {
    const {pathname} = useLocation();
    const [text, setText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let count = 5;
        setTimeout(() => {
            let t = `You will redirect to home page in ${count} sec`;
            setText(t);

            setInterval(() => {
                count -= 1;

                if (count == 0) navigate("/");
                t = `You will redirect to home page in ${count} sec`;
                setText(t);
            }, 1000);

        }, 1000)
    }, [])

    return ( 
    <div className="flex justify-center flex-col items-center">
        <div className="flex items-center justify-center w-max-sm bg-red-500 h-10 w-full">
            <p className="text-center font-bold">'{pathname}' not found.</p>
        </div>
        <p className="font-bold mt-5">{text}</p>
    </div> 
    );
}

export default NotFound;