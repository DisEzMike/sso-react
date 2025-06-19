import { FormEventHandler, useState } from "react";
import { useLocalLogin } from "../function/auth";

type SignInFormProps = {
  getData: (data: {username: string, password: string}) => void;
}

function SignInForm(props: SignInFormProps) {
    const {getData} = props;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit: FormEventHandler = async (e) => {
      e.preventDefault();

      const data = {username, password};
      getData(data);
    }

    return ( 
        <>
          <form action="#" onSubmit={onSubmit} method="POST" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-start text-sm/6 font-medium">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={false}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={false}
                  className="block w-full rounded-md disabled:bg-gray-400 disabled:text-stone-900 bg-white px-3 py-1.5  text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={false}
                className="flex w-full items-center justify-center disabled:bg-gray-400 disabled:text-stone-900 bg-white dark:bg-stone-900 transition-all ease-in duration-75 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-stone-800 hover:text-stone-200 shadow-lg ring-1 ring-black/5"
              >
                Sign in
              </button>
            </div>
        </form>
        </>
     );
}

export default SignInForm;