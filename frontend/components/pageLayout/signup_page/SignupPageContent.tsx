"use client";
import { useEffect, useState } from "react";
import SignUpForm from "@/components/auth-modules/signup/SignUpForm";
import Link from "next/link";
import Image from "next/image";
import LanSwitcher from "@/components/languages/LanSwitcher";
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  span_login: LanguageStrings;
  email: LanguageStrings;
  password: LanguageStrings;
  login: LanguageStrings;
  already_have_account: LanguageStrings;
  signup: LanguageStrings;
  be_part_of: LanguageStrings;
  username: LanguageStrings;
  first_name: LanguageStrings;
  last_name: LanguageStrings;
  education: LanguageStrings;
  school: LanguageStrings;
};
const SignupPageContent = () => {
  const [dictionary, setDictionary] = useState<DictionaryType | null>(null);
  const [language, setLanguage] = useState<"english" | "danish" | "spanish">("english");
  const [reset, setReset] = useState<boolean>(false);
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
    <section className="flex flex-col items-center justify-center  w-full top-10">
      <Image src="/socialCampus_logo.png" width={100} height={100} alt="Picture of the author"></Image>
      <h1 className=" text-[2.5rem] font-bold text-center text-text-dark-gray">
        {dictionary.be_part_of[language]}
        <br></br>
        <span className=" text-accent-purple text-[3rem] "> {dictionary.span_login[language]}</span>
      </h1>
      <SignUpForm
        firstNameContent={dictionary.first_name[language]}
        usernameContent={dictionary.username[language]}
        signupContent={dictionary.signup[language]}
        passwordContent={dictionary.password[language]}
        emailContent={dictionary.email[language]}
        lastNameContent={dictionary.last_name[language]}
        educationContent={dictionary.education[language]}
        schoolContent={dictionary.school[language]}
      ></SignUpForm>
      <div className="flex flex-row gap-1 mt-6">
        <p className="text-link-light-gray font-semibold">{dictionary.already_have_account[language]}</p>
        <Link className=" text-accent-purple font-semibold underline underline-offset-4 hover:text-accent-red" href="/login">
          {dictionary.login[language]}
        </Link>
      </div>
      <LanSwitcher setReset={setReset} reset={reset} />
    </section>
  );
};

export default SignupPageContent;
