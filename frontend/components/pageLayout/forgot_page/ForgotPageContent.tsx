"use client";
import Image from "next/image";
import Link from "next/link";
import Forgot_password from "@/components/auth-modules/forgot_password/Forgot_password";
import { useEffect, useState } from "react";
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  email: LanguageStrings;
  reset_password: LanguageStrings;
  password: LanguageStrings;
  forgot_password: LanguageStrings;
  login: LanguageStrings;
  dont_have_account: LanguageStrings;
  enter_email: LanguageStrings;
  already_have_account: LanguageStrings;
};

const ForgotPageContent = () => {
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
        {dictionary.forgot_password[language]} <br></br>
        <span className=" text-accent-purple text-[3rem] ">{dictionary.enter_email[language]}</span>
      </h1>

      <Forgot_password emailContent={dictionary.email[language]} reset_password={dictionary.reset_password[language]}></Forgot_password>
      <div className="flex flex-row gap-1 mt-6">
        <p className="text-link-light-gray font-semibold">{dictionary.already_have_account[language]}</p>
        <Link className=" text-accent-purple font-semibold underline underline-offset-4 hover:text-accent-red" href="/login">
          {dictionary.login[language]}
        </Link>
      </div>
    </section>
  );
};

export default ForgotPageContent;
