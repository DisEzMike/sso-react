import { FormEvent, useEffect } from "react";
import "./App.css";
import { useParams, useSearchParams } from "react-router-dom";
import GoogleButton from "./components/GoogleButton";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const redirect_url = searchParams.get("redirect_url");
    if (redirect_url) sessionStorage.setItem("redirect_url", redirect_url);
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("submit!");
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>
        <div className="mt-5 mx-auto p-5 isolate aspect-video w-96 rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5">         
          <form action="#" onSubmit={onSubmit} method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-start text-sm/6 font-medium">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled
                  className="block w-full rounded-md disabled:bg-gray-400 disabled:text-stone-900 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium">
                  Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  disabled
                  className="block w-full rounded-md disabled:bg-gray-400 disabled:text-stone-900 bg-white px-3 py-1.5  text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled
                className="flex w-full items-center justify-center disabled:bg-gray-400 disabled:text-stone-900 bg-white dark:bg-stone-900 transition-all ease-in duration-75 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-stone-800 hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign in
              </button>
            </div>
        </form>
        <div className="mt-5 separator font-semibold">Or</div>
        <div className="mt-5">
          <GoogleButton />
        </div>
        </div>
      </div>
    </>
  );
}

export default App;
