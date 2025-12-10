"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type UserData = {
  user_avatar: string;
  change_your_avatar: string;
  change_avatar: string;
};
const ProfileForm = ({ user_avatar, change_your_avatar, change_avatar }: UserData) => {
  const router = useRouter();

  const [profileAvatar, setProfileAvatar] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>(user_avatar || "");
  const [imageNameE, setImageNameE] = useState<string>(user_avatar || "");
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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

      const response = await fetch(`${apiUrl}/update-profile-avatar`, {
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

  return (
    <div className="mb-6">
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      {/* jeg er igang med at få dette image, så det kommer fra database i stedet for */}
      <img className=" rounded-full justify-self-center my-4" src={`${apiUrl}/uploads/${imageNameE}`} alt={imageNameE} width={150} height={150} />

      <form className=" text-center flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full ">
          <label className="text-label-dark-gray font-bold text-center">{change_avatar}</label>
          <input
            className="[text-align-last:center] cursor-pointer px-4  placeholder:text-light-gray text-accent-purple w-full"
            type="file"
            name="userAvatar"
            placeholder={change_avatar}
            onChange={(e) => setProfileAvatar(e.target.files?.[0] || null)}
            // onChange={(e) => setProfileAvatar(e.currentTarget.files?.[0] || null)}
          ></input>
        </div>

        <button className=" bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4  text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500" type="submit">
          {change_your_avatar}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
