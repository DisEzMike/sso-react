import { FormEventHandler, useEffect, useState } from "react";
import "./App.css";
import { useSearchParams } from "react-router-dom";
import GoogleButton from "./components/Button/GoogleButton";
import SignInForm from "./components/SignInForm";
import LineButton from "./components/Button/LineButton";
import { useGoogleLogin } from "@react-oauth/google";
import { getToken, useGoogleLogin as GoogleLogin } from "./function/auth";
import { API_HOST, AUTH_URL } from "./utils/contant";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [client_id, setClientId] = useState(searchParams.get("client_id"));
  const [state, setState] = useState(searchParams.get("state"));
  const [redirect_uri, setRedirectUri] = useState(searchParams.get("redirect_uri") || API_HOST + '/signin');

  useEffect(() => {
    onLoadwithCode();
  })

  const onLoadwithCode = async () => {
    const code = searchParams.get("code");
    if (!code) return;
    const res = await getToken(code);
    const token = res.data;
    console.log(token)    
  }

const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await GoogleLogin({...tokenResponse, client_id, state, redirect_uri});
        window.location.href = response.data.redirect_url;
      } catch (error) {
        console.error(error)
      }
    }
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>
        <div className="mt-5 mx-auto p-5 isolate aspect-video w-96 rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5">         
          <SignInForm />
        <div className="mt-5 separator font-semibold">Or</div>
        <div className="mt-5 flex flex-col gap-2">
          <GoogleButton onClick={() => {login()}} />
          <LineButton />
        </div>
        </div>
      </div>
    </>
  );
}

export default App;
