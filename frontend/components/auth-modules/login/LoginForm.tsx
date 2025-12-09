"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";

type DictionaryType = {
  loginText: string;
  emailText: string;
  forgotPasswordText: string;
  passwordText: string;
  Login_failed: string;
};
const LoginForm = ({ loginText, emailText, forgotPasswordText, passwordText, Login_failed }: DictionaryType) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session status...");
        const response = await fetch("http://127.0.0.1:80/session-check", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          const data = await response.json();
          setErrorMessageGet(data.status);
        }
        if (response.ok) {
          const data = await response.json();
          setErrorMessageGet(data.status);
          if (data.redirect) {
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Error during session check:", err);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:80/login-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);

        router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      setErrorMessageGet(Login_failed);
    }
  };

  return (
    <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <div className="flex flex-col w-full">
        <label className="text-label-dark-gray font-bold">{emailText}</label>
        <input
          className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
          type="email"
          name="email"
          value={email}
          placeholder={emailText}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-label-dark-gray font-bold">{passwordText}</label>
        <input
          className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray w-full h-12 placeholder:text-light-gray caret-accent-purple"
          type="password"
          name="password"
          placeholder={passwordText}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link className=" text-link-light-gray font-semibold underline underline-offset-4 hover:text-accent-purple text-end " href="/forgot_password">
          {forgotPasswordText}
        </Link>
      </div>

      <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
        {loginText}
      </button>
    </form>
  );
};

export default LoginForm;
