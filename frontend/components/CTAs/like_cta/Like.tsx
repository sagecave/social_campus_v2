"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
type postData = {
  post_pk: number;
};
type likeData = {
  likeTotal: number;
  likeCount: number;
};
const Link = ({ post_pk }: postData) => {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likeStatus, setLikeStatus] = useState<number>(0);
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  useEffect(() => {
    const likeGet = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:80/like?post_id=${post_pk}`, {
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
          setLikeCount(data[0].likeCount);
          console.log("LIKED THIS POST", data[0].likeCount);
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("like failed");
      }
    };
    const likeCheck = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:80/like-check?post_id=${post_pk}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();
        setLikeStatus(data[0].liked);
        console.log(data[0].liked, "setLikeStatus");
        console.log("LIKED THIS POST", data);
      } catch (err) {
        console.error("Error during logout:", err);
        alert("like failed");
      } finally {
        console.log(likeStatus, "IS THE POST LIKED YES OR NOT");
      }
    };
    likeGet();
    likeCheck();
  }, [fetchAgain]);

  const likePost = async (e: React.FormEvent<HTMLFormElement>) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    e.preventDefault();
    if (likeStatus == 0) {
      try {
        const response = await fetch(`${apiUrl}/like-post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_pk }),
          credentials: "include",
        });
        if (!response.ok) {
          const data = await response.json();
          console.warn("Signup error:", data);
          alert(data.status);
        }
        if (response.ok) {
          const data = await response.json();
          // const likeTotal = data[0].likeCount;
          // setLikeCount(likeTotal);
          console.log("LIKED THIS POST", data);
          if (data && data[0] && typeof data[0].likeCount === "number") {
            setLikeCount(data[0].likeCount);
          }
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("like failed to like");
      } finally {
        setFetchAgain(!fetchAgain);
        setLikeStatus(1);
      }
    }
    if (likeStatus == 1) {
      try {
        const response = await fetch(`${apiUrl}/like-delete?post_id=${post_pk}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();

        console.log("LIKED THIS POST", data);
        if (data && data[0] && typeof data[0].likeCount === "number") {
          setLikeCount(data[0].likeCount);
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("delete failed");
      } finally {
        setFetchAgain(!fetchAgain);
        setLikeStatus(0);
      }
    }
  };

  return (
    <div className={likeStatus ? "bg-accent-purple-light   w-fit  rounded-4xl py-2 px-4 pointer" : " hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer"}>
      <form className="pointer " onSubmit={likePost}>
        <button className="flex gap-2" type="submit">
          <Image src="/heart_icon.svg" alt="Picture of the author" width={25} height={25} />
          <p>{likeCount}</p>
        </button>
      </form>
    </div>
  );
};

export default Link;
