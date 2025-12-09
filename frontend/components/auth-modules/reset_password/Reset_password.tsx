"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type DictionaryType = {
  change_password: string;
  new_password: string;
  enter_new_password: string;
};
const Reset_password = ({ change_password, new_password, enter_new_password }: DictionaryType) => {
  const router = useRouter();
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const params = useSearchParams();
  const token = params.get("key");
  //   const [valid, setValid] = useState(false);
  //   const [status, setStatus] = useState<"loading" | "invalid" | "expired" | "valid">("loading");

  //   useEffect(() => {
  //     if (!token) {
  //       return;
  //     }

  //     const check = async () => {
  //       const res = await fetch(`http://127.0.0.1:80/token-check?key=${token}`);
  //       const data = await res.json();

  //       if (!data.valid) {
  //         if (data.expired) setStatus("expired");
  //         else setStatus("invalid");
  //       } else {
  //         setStatus("valid");
  //       }
  //     };
  //   }, [token]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:80/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
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
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Login failed");
    }
  };
  //   if (status === "loading") return <p>Checking…</p>;
  //   if (status === "invalid") return <p>Invalid link.</p>;
  //   if (status === "expired") return <p>Link expired. Request a new one.</p>;
  //   if (!valid) return <p>Invalid or expired link.</p>;
  return (
    <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <div className="flex flex-col w-full">
        <label className="text-label-dark-gray font-bold">{new_password}</label>
        <input
          className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
          type="password"
          name="password"
          value={password}
          placeholder={enter_new_password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
        {change_password}
      </button>
    </form>
  );
};

export default Reset_password;
