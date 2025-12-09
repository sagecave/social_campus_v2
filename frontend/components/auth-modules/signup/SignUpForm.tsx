"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";

type DictionaryType = {
  firstNameContent: string;
  usernameContent: string;
  signupContent: string;
  passwordContent: string;
  emailContent: string;
  lastNameContent: string;
  educationContent: string;
  schoolContent: string;
};

const SignUpForm = ({ firstNameContent, usernameContent, signupContent, passwordContent, emailContent, lastNameContent, educationContent, schoolContent }: DictionaryType) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [shcool, setSchool] = useState<string>("");
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:80/signup-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, firstName, lastName, education, shcool }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        console.warn("Signup error:", data);
        setErrorMessageGet(data.status);
        // alert(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        console.log("data login form", data);
        setErrorMessageGet(data.status);
        router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Sign Up failed");
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
        if (!response.ok) {
          const data = await response.json();
          console.warn("Signup error:", data);
          // alert(data.status);
        }
        if (response.ok) {
          const data = await response.json();
          console.log("Session check data:", data);
          if (data.redirect) {
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Error during session check:", err);
      }
    };
    checkSession();
  }, []);

  return (
    <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <div className="flex flex-col w-full">
        <label className="text-label-dark-gray font-bold">{usernameContent}</label>
        <input
          className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
          type="text"
          name="username"
          value={username}
          placeholder={usernameContent}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col w-full">
        <label className="text-label-dark-gray font-bold">{emailContent}</label>
        <input
          className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
          type="text"
          name="email"
          value={email}
          placeholder={emailContent}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">{firstNameContent}</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="firstname"
            value={firstName}
            placeholder={firstNameContent}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">{lastNameContent}</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="lastname"
            value={lastName}
            placeholder={lastNameContent}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">{educationContent}</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="education"
            value={education}
            placeholder={educationContent}
            onChange={(e) => setEducation(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">{schoolContent}</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="text"
            name="shcool"
            value={shcool}
            placeholder={schoolContent}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-label-dark-gray font-bold">{passwordContent}</label>
        <input
          className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
          type="text"
          name="password"
          placeholder={passwordContent}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
        {signupContent}
      </button>
    </form>
  );
};

export default SignUpForm;
