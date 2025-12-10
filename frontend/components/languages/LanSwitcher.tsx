"use client";
import { useState } from "react";

type ResetLan = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  reset: boolean;
};

const LanSwitcher = ({ setReset, reset }: ResetLan) => {
  const [language, setLanguage] = useState<string>("english");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLanguage = async (newLang: string) => {
    try {
      const response = await fetch(`${apiUrl}/set-language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
        credentials: "include",
      });

      if (response.ok) {
        setReset((prev) => !prev);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <select
      name="language"
      value={language}
      onChange={(e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        handleLanguage(newLang);
      }}
    >
      <option value="danish">Danish</option>
      <option value="english">English</option>
      <option value="spanish">Spanish</option>
    </select>
  );
};

export default LanSwitcher;
