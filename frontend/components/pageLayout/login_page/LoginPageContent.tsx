"use client";
import { useEffect, useState } from "react";
import LoginForm from "@/components/auth-modules/login/LoginForm";
import Image from "next/image";
import Link from "next/link";
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  h1_login: LanguageStrings;
  span_login: LanguageStrings;
  email: LanguageStrings;
  password: LanguageStrings;
  forgot_password: LanguageStrings;
  login: LanguageStrings;
  dont_have_account: LanguageStrings;
  signup: LanguageStrings;
  Login_failed: LanguageStrings;
};
const LoginPageContent = () => {
  const [dictionary, setDictionary] = useState<DictionaryType | null>(null);
  const [language, setLanguage] = useState<"english" | "danish" | "spanish">("english");

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        console.log("Fetching dictionary...");
        const response = await fetch("http://127.0.0.1:80/dictionary", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          console.warn("Dictionary fetch error:", data);
          return;
        }

        const data = await response.json();
        console.log("Dictionary data:", data[0]);
        setDictionary(data[0]);
        setLanguage(data[1]);
      } catch (err) {
        console.error("Error fetching dictionary:", err);
      }
    };

    fetchDictionary();
  }, [language]);
  if (!dictionary) return <p>Loading dictionary...</p>;
  return (
    <section className="flex flex-col items-center justify-center  w-full h-screen">
      <Image src="/socialCampus_logo.png" width={100} height={100} alt="Picture of the author"></Image>

      <h1 className=" text-[2.5rem] font-bold text-center text-text-dark-gray">
        {dictionary.h1_login[language]}
        <br></br>
        <span className=" text-accent-purple text-[3rem] ">{dictionary.span_login[language]}</span>
      </h1>
      <LoginForm
        Login_failed={dictionary.Login_failed[language]}
        loginText={dictionary.login[language]}
        emailText={dictionary.email[language]}
        forgotPasswordText={dictionary.forgot_password[language]}
        passwordText={dictionary.password[language]}
      ></LoginForm>
      <div className="flex flex-row gap-1 mt-6">
        <p className="text-link-light-gray font-semibold">{dictionary.dont_have_account[language]}</p>
        <Link className=" text-accent-purple font-semibold underline underline-offset-4 hover:text-accent-red" href="/signup">
          {dictionary.signup[language]}
        </Link>
      </div>
    </section>
  );
};

export default LoginPageContent;
