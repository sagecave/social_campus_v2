"use client";

import React, { useState, useEffect } from "react";
import ProfileForm from "@/components/profile_form/ProfileForm";
import DeleteProfile from "@/components/CTAs/delete_account/DeleteAccount";
import ProfileImageUpdate from "@/components/profile_form/ProfileImageUpdate";

type UserData = {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_username: string;
  user_avatar: string;
};
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  change_avatar: LanguageStrings;
  change_your_avatar: LanguageStrings;
  delete_account: LanguageStrings;
  update_profile: LanguageStrings;
  profile: LanguageStrings;
  username: LanguageStrings;
  email: LanguageStrings;
  first_name: LanguageStrings;
  last_name: LanguageStrings;
};

const ProfilePasswordPage = ({ user_avatar, user_first_name, user_last_name, user_email, user_username }: UserData) => {
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
    <section>
      <h1>profile</h1>
      <ProfileImageUpdate change_your_avatar={dictionary.change_your_avatar[language]} change_avatar={dictionary.change_avatar[language]} user_avatar={user_avatar} />

      <ProfileForm
        user_name={dictionary.username[language]}
        emailLan={dictionary.email[language]}
        first_name={dictionary.first_name[language]}
        last_name={dictionary.last_name[language]}
        update_profile={dictionary.update_profile[language]}
        user_first_name={user_first_name}
        user_last_name={user_last_name}
        user_email={user_email}
        user_username={user_username}
      ></ProfileForm>
      <DeleteProfile delete_account={dictionary.delete_account[language]} />
    </section>
  );
};

export default ProfilePasswordPage;
