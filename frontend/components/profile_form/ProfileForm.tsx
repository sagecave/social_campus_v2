"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  user_first_name: string;
  user_last_name: string;
  user_username: string;
  user_email: string;
};
const ProfileForm = ({ user_first_name, user_last_name, user_username, user_email }: UserData) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>(user_email);
  const [username, setUsername] = useState<string>(user_username);
  const [firstName, setFirstName] = useState<string>(user_first_name);
  const [lastName, setLastName] = useState<string>(user_last_name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:80/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, firstName, lastName }),
        credentials: "include",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const data = await response.json();
      console.log("data login form", data);
      //   router.push(typeof data === "string" ? data : data.redirect ?? "/");
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
        const response = await fetch("http://127.0.0.1:80/session-check", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        console.log("Session check data:", data);
        // if (data.redirect) {
        //   //   router.push("/");

        // }
      } catch (err) {
        console.error("Error during session check:", err);
      }
    };
    checkSession();
  }, []);

  return (
    <div>
      <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">Username</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">Email</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="email"
            value={email}
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col w-full">
            <label className="text-label-dark-gray font-bold">First name</label>
            <input
              className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
              type="text"
              name="firstname"
              value={firstName}
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-label-dark-gray font-bold">Last name</label>
            <input
              className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
              type="text"
              name="lastname"
              value={lastName}
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
          Update your profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
