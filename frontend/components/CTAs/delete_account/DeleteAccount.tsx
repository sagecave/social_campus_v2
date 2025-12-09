"use client";
import Image from "next/image";

// type postData = {
//   setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
//   newFetch: boolean;
// };
// const DeleteProfile = ({ setNewFetch, newFetch }: postData)
type DictionaryType = {
  delete_account: string;
};
const DeleteProfile = ({ delete_account }: DictionaryType) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const deletingAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/delete-profile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        console.warn("Signup error:", data);
        alert(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        console.log("data logout form", data);
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Deleting account failed");
    } finally {
      //   setNewFetch(!newFetch);
    }
  };
  return (
    <div className=" hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer">
      <form className="pointer " onSubmit={deletingAccount}>
        <button className="flex gap-2" type="submit">
          <Image className=" " src="/delete.svg" alt="Picture of the author" width={25} height={25} />
          <p>{delete_account}</p>
        </button>
      </form>
    </div>
  );
};

export default DeleteProfile;
