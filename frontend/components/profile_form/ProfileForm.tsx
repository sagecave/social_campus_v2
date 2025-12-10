"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";

type UserData = {
  user_first_name: string;
  user_last_name: string;
  user_username: string;
  user_email: string;
  user_name: string;
  emailLan: string;
  first_name: string;
  last_name: string;
  update_profile: string;
};

const ProfileForm = ({ emailLan, update_profile, last_name, first_name, user_name, user_first_name, user_last_name, user_username, user_email }: UserData) => {
  const router = useRouter();

  const [emailContent, setEmailContent] = useState<string>(user_email);
  const [username, setUsername] = useState<string>(user_username);
  const [firstName, setFirstName] = useState<string>(user_first_name);
  const [lastName, setLastName] = useState<string>(user_last_name);
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/update-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, username, firstName, lastName }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
      }
      if (response.ok) {
        // const data = await response.json();
        setErrorMessageGet("You have updated your profile");
        //   router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Update failed");
    }
  };
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session status...");
        const response = await fetch(`${apiUrl}/session-check`, {
          method: "GET",
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
          // if (data.redirect) {
          //   //   router.push("/");

          // }
        }
      } catch (err) {
        console.error("Error during session check:", err);
      }
    };
    checkSession();
  }, []);

  return (
    <div>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold ">{user_name}</label>
          <input
            className=" text-left
 px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="username"
            value={username}
            placeholder={user_name}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">{emailLan}</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="email"
            value={emailContent}
            placeholder={emailLan}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col w-full">
            <label className="text-label-dark-gray font-bold">{first_name}</label>
            <input
              className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
              type="text"
              name="firstname"
              value={firstName}
              placeholder={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-label-dark-gray font-bold">{last_name}</label>
            <input
              className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
              type="text"
              name="lastname"
              value={lastName}
              placeholder={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
          {update_profile}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
