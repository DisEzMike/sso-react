import { FormEventHandler, useEffect, useState } from "react";
import "./App.css";
import { useSearchParams } from "react-router-dom";
import GoogleButton from "./components/Button/GoogleButton";
import SignInForm from "./components/SignInForm";
import LineButton from "./components/Button/LineButton";
import { useGoogleLogin } from "@react-oauth/google";
import { getToken, useGoogleLogin as GoogleLogin } from "./function/auth";
import { HOST, LOCAL_CLIENT_ID, LOCAL_CLIENT_SECRET } from "./utils/contant";
import { getUser } from "./function/user";
import { Token } from "../server/src/utils/interfaces";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clientId, setClientId] = useState(searchParams.get("client_id"));
  const [state, setState] = useState(searchParams.get("state"));
  const [redirectUri, setRedirectUri] = useState(searchParams.get("redirect_uri") || HOST);

  useEffect(() => {
    onLoadwithCode();
  }, [])

  const onLoadwithCode = async () => {
    const code = searchParams.get("code");
    if (!code) return;
    const client_id = !clientId ? LOCAL_CLIENT_ID! : clientId;
    const client_secret = LOCAL_CLIENT_SECRET!
    const redirect_uri = !redirectUri ? HOST! : redirectUri;
    const payload: Token = {
      grant_type: "authorization_code",
      code,
      client_id,
      client_secret,
      redirect_uri
    }

    console.log(payload)

    const res = await getToken(payload);
    const token = res.data; 
    sessionStorage.setItem("token", token.access_token);
    await loadProfile()
  }

  const loadProfile = async () => {
    const user = await getUser();
    console.log(user);
  }

const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const client_id = !clientId ? LOCAL_CLIENT_ID! : clientId;
        const redirect_uri = redirectUri!;
        const payload = {
          ...tokenResponse,
          client_id, 
          state, 
          redirect_uri
        };
        const response = await GoogleLogin(payload);
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
          <LineButton disabled />
        </div>
        </div>
      </div>
    </>
  );
}

export default App;
