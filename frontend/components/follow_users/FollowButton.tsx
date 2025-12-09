"use client";
import { useState, useEffect } from "react";
type userData = {
  user_pk: number;
  unfollow: string;
  follow: string;
};
const FollowButton = ({ user_pk, unfollow, follow }: userData) => {
  const [followStatus, setFollowStatus] = useState<number>(0);
  const [followFetchUpdate, setFollowFetchUpdate] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const followingCheck = async () => {
      try {
        const response = await fetch(`${apiUrl}/following-check?follower_id=${user_pk}`, {
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
          setFollowStatus(data[0].followed);
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("follow check failed failed");
      }
    };
    followingCheck();
  }, [followFetchUpdate]);
  const likePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (followStatus == 0) {
      try {
        const response = await fetch(`${apiUrl}/follow-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_pk }),
          credentials: "include",
        });
        if (!response.ok) {
          const data = await response.json();
          console.warn("Signup error:", data);
          alert(data.status);
        }
        if (response.ok) {
          const data = await response.json();
          setFollowFetchUpdate(!followFetchUpdate);
          setMessage(data);

          console.log(data, "WHAT IS IN THIS");
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("following failed");
      }
    }
    if (followStatus == 1) {
      try {
        const response = await fetch(`${apiUrl}/unfollow-user?follower_id=${user_pk}`, {
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
          setFollowFetchUpdate(!followFetchUpdate);
          setMessage(data);
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("unfollowing failed");
      }
    }
  };

  return (
    <div className={followStatus ? "bg-accent-purple-light   w-fit  rounded-4xl py-2 px-4 pointer" : " hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer"}>
      <form className="pointer " onSubmit={likePost}>
        <button className="flex gap-2" type="submit">
          {followStatus ? <p>{unfollow}</p> : <p>{follow}</p>}
        </button>
      </form>
    </div>
  );
};

export default FollowButton;
