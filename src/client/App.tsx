import { FormEventHandler, useEffect, useState } from "react";
import "./App.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import GoogleButton from "./components/Button/GoogleButton";
import SignInForm from "./components/SignInForm";
import LineButton from "./components/Button/LineButton";
import { useGoogleLogin } from "@react-oauth/google";
import { getToken, useGoogleLogin as GoogleLogin, useLocalLogin, useSSOLogin } from "./function/auth";
import { HOST, LOCAL_CLIENT_ID, LOCAL_CLIENT_SECRET } from "./utils/contant";
import { getUser } from "./function/user";
import { Token } from "../server/src/utils/interfaces";
import { AxiosError } from "axios";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clientId, setClientId] = useState(searchParams.get("client_id"));
  const [state, setState] = useState(searchParams.get("state"));
  const [redirectUri, setRedirectUri] = useState(searchParams.get("redirect_uri") || HOST);
  const [scope, setScope] = useState(searchParams.get("scope") || HOST);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    onLoadwithCode();
    if (scope && !scope.split(" ").includes("nosso")) onLoadwithSSO();
  }, [])

  const onLoadwithSSO = async () => {
    const client_id = !clientId ? LOCAL_CLIENT_ID! : clientId;
    const redirect_uri = !redirectUri ? HOST! : redirectUri;
    if (sessionStorage.getItem('token') && redirect_uri == HOST) return;
    const data = {
      client_id,
      redirect_uri,
      state
    }
    try {
      const response = await useSSOLogin(data);
      console.log(response.data)
      window.location.href = response.data.redirect_url;
    } catch (error) {
      console.log(error)
    }


  }

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
    };
    const res = await getToken(payload);
    const token = res.data; 
    sessionStorage.setItem("token", token.access_token);
    localStorage.setItem("refresh_token", token.refresh_token);
    navigate("/")
    await loadProfile()
  }

  const loadProfile = async () => {
    const user = await getUser();
    console.log(user);
  }

const SignInWithGoogle = useGoogleLogin({
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

  const LocalSignIn = async (data: {username: string, password: string}) => {
    try {
      const client_id = !clientId ? LOCAL_CLIENT_ID! : clientId;
        const redirect_uri = redirectUri!;
        const payload = {
          ...data,
          client_id, 
          state, 
          redirect_uri
        };
      const response = await useLocalLogin(payload);
      window.location.href = response.data.redirect_url;
    } catch (error) {
      console.error(error);
      const message = error instanceof AxiosError ? error.response!.data.message : (error as any).message;
      setErrorMsg(message);
    }

  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 lg:px-8">
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
        Sign in to Natchapon App
      </h2>
      <div className="mt-5 mx-auto p-5 isolate aspect-video w-96 rounded-xl bg-white dark:bg-white/20 shadow-lg ring-1 ring-black/5">
        {errorMsg &&
        <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-stone-900 dark:text-red-400 transition-all ease-in duration-75" role="alert">
          <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div className="ms-3 text-sm font-medium">
            {errorMsg}
          </div>
          <button type="button" onClick={() => setErrorMsg("")} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-stone-900 dark:text-red-400 dark:hover:bg-stone-700" data-dismiss-target="#alert-2" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        }
        <SignInForm getData={async (data) => LocalSignIn(data)} />
        <div className="mt-2 separator font-semibold">Or</div>
        <div className="mt-5 flex flex-col gap-2">
        <GoogleButton onClick={() => {SignInWithGoogle()}} />
        <LineButton disabled />
      </div>
      </div>
    </div>
  );
}

export default App;
