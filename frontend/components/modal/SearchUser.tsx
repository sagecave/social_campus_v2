"use client";
import { useState, useEffect } from "react";

// import { useRouter } from "next/navigation";
import UserCards from "@/components/search/UserCards";
// import Link from "next/link";
type User = {
  user_pk: number;
  user_username: string;
  user_avatar: string;
  user_first_name: string;
  user_last_name: string;
};
type modalStatus = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: string;
  search_for_users: string;
  unfollow: string;
  follow: string;
};

const SearchUser = ({ modalOpen, setModalOpen, unfollow, follow, search_for_users, close }: modalStatus) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const [searchOutput, setSearchOutput] = useState<User[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const handleSearch = async () => {
      if (searchInput.length >= 1) {
        try {
          const response = await fetch(`${apiUrl}/search-users?search_input=${searchInput}`, {
            method: "GET",
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
            console.log("search check", data);
            setSearchOutput(data);
          }
        } catch (err) {
          console.error("Error during login:", err);
          // Make alert to a user-friendly notification in the future
          alert("search failed");
        }
      }
      if (searchInput.length == 0) {
        try {
          const response = await fetch(`${apiUrl}/search_random-users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) {
            const data = await response.json();
            console.warn("Signup error:", data);
          }
          if (response.ok) {
            const data = await response.json();
            console.log("search check", data);
            setSearchOutput(data);
          }
        } catch (err) {
          console.error("Error during login:", err);
          // Make alert to a user-friendly notification in the future
          alert("search failed");
        }
      }
    };
    handleSearch();
  }, [searchInput]);
  const searchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <section className="w-full ">
      <div
        className="absolute w-[21rem] md:w-[40rem]  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                   bg-inside-border-white border border-border-grey rounded-xl px-4 pt-2 pb-10"
      >
        <h2 className="p-3 text-[1.2rem] font-semibold text-accent-purple">{search_for_users}</h2>
        <form onSubmit={searchSubmit} className="p-4 border-border-grey border-1 rounded-3xl flex flex-col ">
          <label className="text-label-dark-gray font-bold">{search_for_users}</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            name="searchForUser"
            id="searchForUser"
            placeholder={search_for_users}
          ></input>
          <div className="flex gap-2 flex-row-reverse">
            <button onClick={() => setModalOpen(!modalOpen)} className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
              {close}
            </button>
          </div>
        </form>
        {searchOutput.map((user, i) => (
          <UserCards unfollow={unfollow} follow={follow} key={i} user_pk={user.user_pk} user_avatar={user.user_avatar} user_first_name={user.user_first_name} user_last_name={user.user_last_name} user_username={user.user_username} />
        ))}
      </div>
    </section>
  );
};

export default SearchUser;
