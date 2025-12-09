"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutForm from "../auth-modules/logout/LogoutForm";
import SearchUser from "../modal/SearchUser";

type userData = {
  user_first_name: string;
  user_last_name: string;
};
type modalStatus = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  span_login: LanguageStrings;
  home: LanguageStrings;
  search: LanguageStrings;
  close: LanguageStrings;
  search_for_users: LanguageStrings;
  unfollow: LanguageStrings;
  follow: LanguageStrings;
  logout: LanguageStrings;
};
const Aside_navigation = ({ user_first_name, user_last_name }: userData) => {
  const [dictionary, setDictionary] = useState<DictionaryType | null>(null);
  const [language, setLanguage] = useState<"english" | "danish" | "spanish">("english");

  const [modalOpen, setModalOpen] = useState<boolean>(false);
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
    <nav className=" col-start-1 p-4 border-r-1 border-border-grey">
      <header className="flex gap-2 items-center">
        <Image src="/socialCampus_logo.png" alt="Picture of the author" width={50} height={50} />
        <h1 className="text-accent-purple text-[1.2rem] font-bold">{dictionary.span_login[language]}</h1>
      </header>
      <ul className="mt-6 flex flex-col gap-2">
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem] w-full h-full" href="/">
            <Image src="/home.svg" alt="Picture of the author" width={30} height={30} />
            {dictionary.home[language]}
          </Link>
        </li>
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <button
            className="flex gap-2 text-[1.2rem] w-full h-full"
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <Image src="/search.svg" alt="Picture of the author" width={30} height={30} /> {dictionary.search[language]}
          </button>
        </li>
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem] capitalize w-full h-full" href="/profile">
            <Image src="/profile.svg" alt="Picture of the author" width={30} height={30} />
            {/* <img className=" rounded-full" src={`http://127.0.0.1/uploads/${user_avatar}`} alt="profil billede" width={50} height={50} /> */}
            {user_first_name} {user_last_name}
          </Link>
        </li>
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem] w-full h-full" href="/admin">
            <Image src="/admin.svg" alt="Picture of the author" width={30} height={30} />
            {/* {dictionary.home[language]} */}
            Admin
          </Link>
        </li>

        {modalOpen ? (
          <SearchUser close={dictionary.close[language]} search_for_users={dictionary.search_for_users[language]} follow={dictionary.follow[language]} unfollow={dictionary.unfollow[language]} setModalOpen={setModalOpen} modalOpen={modalOpen} />
        ) : (
          <></>
        )}
        <li className="mt-6">
          <LogoutForm logout={dictionary.logout[language]}></LogoutForm>
        </li>
      </ul>
    </nav>
  );
};

export default Aside_navigation;
