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
const SearchUser = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchOutput, setSearchOutput] = useState<User[]>([]);
  useEffect(() => {
    const handleSearch = async () => {
      if (searchInput.length >= 1) {
        try {
          const response = await fetch(`http://127.0.0.1:80/search-users?search_input=${searchInput}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
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
          const response = await fetch(`http://127.0.0.1:80/search_random-users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
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
    <section className=" relative">
      <div
        className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                   bg-inside-border-white border border-border-grey rounded-xl px-4 pt-2 pb-10"
      >
        <h2 className="p-3 text-[1.2rem] font-semibold text-accent-purple">Search for users</h2>
        {searchOutput.map((user, i) => (
          <UserCards key={i} user_avatar={user.user_avatar} user_first_name={user.user_first_name} user_last_name={user.user_last_name} user_username={user.user_username} />
        ))}

        <div></div>
        <form onSubmit={searchSubmit} className="p-4 border-border-grey border-1 rounded-3xl flex flex-col ">
          <label className="text-label-dark-gray font-bold">Search for users</label>
          <input
            className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full"
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            name="searchForUser"
            id="searchForUser"
            placeholder="Make a search by username"
          ></input>
          <div className="flex gap-2 flex-row-reverse">
            {/* <button onClick={() => setIsModalOpen(!isModalOpen)} className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
              Close
            </button> */}
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchUser;
