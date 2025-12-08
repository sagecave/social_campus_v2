"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type UserData = {
  user_avatar: string;
};
const ProfileForm = ({ user_avatar }: UserData) => {
  const router = useRouter();

  const [profileAvatar, setProfileAvatar] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>(user_avatar || "");
  const [imageNameE, setImageNameE] = useState<string>(user_avatar || "");
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profileAvatar) {
        formData.append("profileAvatar", profileAvatar);
        setImageName(profileAvatar?.name);
        console.log(profileAvatar.name, "AVATAR PROFILE");
        formData.append("imageName", imageName);
      }

      const response = await fetch("http://127.0.0.1:80/update-profile-avatar", {
        method: "PATCH",

        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        console.log("data login form", data);
        setErrorMessageGet(data.status);
        //   router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Update failed");
    } finally {
      setImageNameE(imageName);
    }
  };
  //   useEffect(() => {
  //     const checkSession = async () => {
  //       try {
  //         console.log("Checking session status...");
  //         const response = await fetch("http://127.0.0.1:80/session-check", {
  //           method: "GET",
  //           headers: { "Content-Type": "application/json" },
  //           credentials: "include",
  //         });
  //         const data = await response.json();
  //         console.log("Session check data:", data);
  //         // if (data.redirect) {
  //         //   //   router.push("/");

  //         // }
  //       } catch (err) {
  //         console.error("Error during session check:", err);
  //       }
  //     };
  //     checkSession();
  //   }, []);

  return (
    <div>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      {/* jeg er igang med at få dette image, så det kommer fra database i stedet for */}
      <img className=" rounded-full" src={`http://127.0.0.1/uploads/${imageNameE}`} alt={imageNameE} width={50} height={50} />
      {/* <Image src={"http://127.0.0.1/uploads/0b8f19cd-f8bf-43a6-886a-1be53fe89c60.png"} alt={imageName} width={50} height={50} /> */}
      {/* <Image src={profileAvatar} alt="Picture of the author" width={50} height={50} /> */}
      <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full">
          <label className="text-label-dark-gray font-bold">Avatar</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            type="file"
            name="userAvatar"
            placeholder="Avatar"
            onChange={(e) => setProfileAvatar(e.target.files?.[0] || null)}
            // onChange={(e) => setProfileAvatar(e.currentTarget.files?.[0] || null)}
          ></input>
        </div>

        <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
          Change your avatar
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
