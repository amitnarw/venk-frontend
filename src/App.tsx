import { useEffect, useState } from "react";
import "./App.css";
import MiniLoader from "./components/MiniLoader";
import GameList from "./components/GameList";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState({
    value: "",
    error: "",
  });
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, [])

  const login = async () => {
    try {
      setIsLoading(true);
      let result = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}auth/login`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            loginType: "email",
            email: email.value,
          }),
        }
      );
      let data = await result.json();
      if (data?.success) {
        setUserData(data?.data);
        localStorage.setItem('userData', JSON.stringify(data?.data))
      } else {
        setEmail((preVal) => ({ ...preVal, error: data?.error }));
      }
    } catch (err: any) {
      setEmail((preVal) => ({ ...preVal, error: err }));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
      {!userData?.userId ? (
        <div className="flex flex-col gap-4 items-center justify-center">
          <p className="text-white text-4xl font-bold">LOGIN</p>
          <input
            className="rounded-xl border border-white p-2 text-center outline-none"
            placeholder="Email address"
            value={email?.value}
            onChange={(e) =>
              setEmail((preVal) => ({ ...preVal, value: e.target.value }))
            }
          />
          {email?.error && <p className="text-red-300">{email?.error}</p>}
          {isLoading ? (
            <div>
              <MiniLoader />
            </div>
          ) : (
            <button
              className="p-2 px-5 rounded-xl bg-white/70 hover:bg-white cursor-pointer text-black duration-300"
              onClick={login}
            >
              Click to login
            </button>
          )}
        </div>
      ) : (
          <GameList />
      )}
    </div>
  );
}

export default App;
