"use client";
import { useEffect, useState } from "react";
import Reset_password from "@/components/auth-modules/reset_password/Reset_password";
import Image from "next/image";
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  forgot_password_question: LanguageStrings;
  change_it_here: LanguageStrings;
  change_password: LanguageStrings;
  new_password: LanguageStrings;
  enter_new_password: LanguageStrings;
};
const ResetPasswordPage = () => {
  const [dictionary, setDictionary] = useState<DictionaryType | null>(null);
  const [language, setLanguage] = useState<"english" | "danish" | "spanish">("english");

  const apiUrlDict = process.env.NEXT_PUBLIC_API_URL_DICTIONARY;
  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        console.log("Fetching dictionary...");
        const response = await fetch(`${apiUrlDict}/dictionary`, {
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
        {dictionary.forgot_password_question[language]} <br></br>
        <span className=" text-accent-purple text-[3rem] ">{dictionary.change_it_here[language]}</span>
      </h1>
      <Reset_password enter_new_password={dictionary.new_password[language]} new_password={dictionary.new_password[language]} change_password={dictionary.change_password[language]}></Reset_password>
    </section>
  );
};

export default ResetPasswordPage;
