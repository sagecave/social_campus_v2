"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type DictionaryType = {
  logout: string;
};
const LogoutForm = ({ logout }: DictionaryType) => {
  const router = useRouter();
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:80/logout-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
        router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setErrorMessageGet("Logout failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <button className="flex gap-2 border-accent-purple border-2 hover:bg-accent-purple-light-white rounded-3xl px-4 py-2 bg-inside-border-white font-medium text-button-text" type="submit">
        <Image className=" rounded-b-full" src="/logout.svg" alt="Picture of the author" width={20} height={20} />
        {logout}
      </button>
    </form>
  );
};

export default LogoutForm;
