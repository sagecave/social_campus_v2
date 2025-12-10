"use client";
import { useState, useEffect } from "react";
type resetLan = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  reset: boolean;
};
const LanSwitcher = ({ setReset, reset }: resetLan) => {
  const [language, setlanguage] = useState<string>("english");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleLanguage = async (language: string) => {
    // e.preventDefault();
    console.log(language);
    try {
      const response = await fetch(`${apiUrl}/set-language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        // setErrorMessageGet(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // setErrorMessageGet(data.status);

        // router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      // setErrorMessageGet(Login_failed);
    } finally {
      setReset(!reset);
    }
  };
  useEffect(() => {
    handleLanguage(language);
  }, [language]);

  return (
    <select name="language" value={language} onChange={(e) => setlanguage(e.target.value)}>
      <option value="danish">Danish</option>
      <option value="english">English</option>
      <option value="spanish">Spanish</option>
    </select>
  );
};

export default LanSwitcher;
