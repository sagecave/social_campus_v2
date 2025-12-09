"use client";

import React, { useState, useEffect } from "react";

import PostContainer from "@/components/posts/PostContainer";

import CreatePost from "@/components/posts/CreatePost";
type LanguageStrings = {
  english: string;
  danish: string;
  spanish: string;
};
type DictionaryType = {
  update_post: LanguageStrings;
  make_comment: LanguageStrings;
  edit_post: LanguageStrings;
  post: LanguageStrings;
  post_update_placeholder: LanguageStrings;
  close: LanguageStrings;
};
type UserData = {
  user_avatar: string;
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;
};
export default function FrontPageContent({ user_avatar, setNewFetch, newFetch }: UserData) {
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
    <>
      <CreatePost post={dictionary.post[language]} post_update_placeholder={dictionary.post_update_placeholder[language]} setNewFetch={setNewFetch} newFetch={newFetch}></CreatePost>
      <section className=" col-start-2">
        <PostContainer
          update_post={dictionary.update_post[language]}
          close={dictionary.close[language]}
          make_comment={dictionary.make_comment[language]}
          edit_post={dictionary.edit_post[language]}
          post={dictionary.post[language]}
          user_avatar={user_avatar}
          setNewFetch={setNewFetch}
          newFetch={newFetch}
        />
      </section>
    </>
  );
}
