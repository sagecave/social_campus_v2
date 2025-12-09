"use client";
import { useState, useEffect } from "react";

const LanSwitcher = () => {
  const [language, setlanguage] = useState<string>("english");

  const handleLanguage = async () => {
    // e.preventDefault();
    console.log(language);
    try {
      const response = await fetch("http://127.0.0.1:80/set-language", {
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
    }
  };

  return (
    <form method="POST">
      <select
        name="language"
        value={language}
        onChange={(e) => {
          setlanguage(e.target.value);
        }}
      >
        <option value="danish">Danish</option>
        <option value="english">English</option>
        <option value="spanish">Spanish</option>
      </select>
      <button type="submit">Change language</button>
    </form>
  );
};

export default LanSwitcher;
