"use client";
import { useState, useEffect } from "react";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type userData = {
  user_pk: number;
  user_block_status: string;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAgain: boolean;
  user_email: string;
};
const BlockUnblockUser = ({ user_pk, user_block_status, setFetchAgain, fetchAgain, user_email }: userData) => {
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");
  const [blockStatus, SetblockStatus] = useState<boolean>(false);
  const [followStatus, setFollowStatus] = useState<number>(0);
  const [followFetchUpdate, setFollowFetchUpdate] = useState<boolean>(false);
  useEffect(() => {
    const followingCheck = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:80/block-check?user_id=${user_pk}`, {
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
          console.log(data);
          setFollowStatus(data.userStatus);
        }
      } catch (err) {
        console.error("Error during logout:", err);
        // alert("follow check failed failed");
      }
    };
    followingCheck();
  }, [fetchAgain]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStatus = user_block_status === "notBlock" ? "block" : "notBlock";
    const blockButton = user_block_status === "notBlock" ? true : false;
    SetblockStatus(blockButton);
    try {
      const response = await fetch("http://127.0.0.1:80/admin-block-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_pk, newStatus, user_email }),
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
        setFetchAgain(!fetchAgain);
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Sign Up failed");
    }
  };
  return (
    <>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <div className={followStatus ? "bg-accent-purple-light   w-fit  rounded-4xl py-2 px-4 pointer" : " hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer"}>
        <form className="pointer " onSubmit={handleSubmit}>
          <button className="flex gap-2" type="submit">
            {followStatus ? <p>Block user</p> : <p>Unblock user</p>}
          </button>
        </form>
      </div>
    </>
  );
};

export default BlockUnblockUser;
