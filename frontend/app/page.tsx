"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import PostContainer from "@/components/posts/PostContainer";
import Aside_navigation from "@/components/navigation/Aside_navigation";
import CreatePost from "@/components/posts/CreatePost";
import FrontPageContent from "@/components/pageLayout/front_page/FrontPageContent";

type UserData = {
  user_first_name: string;
  user_last_name: string;
  user_avatar: string;
};
export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFetch, setNewFetch] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const sessionResponse = await fetch(`${apiUrl}/session-check`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const session = await sessionResponse.json();

        if (!session.redirect) {
          router.push("/login");
          return;
        }

        const userData = await fetch(`${apiUrl}/user-data`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!userData.ok) {
          const data = await userData.json();
          console.warn("Signup error:", data);
          alert(data.status);
        }
        if (userData.ok) {
          const data = await userData.json();
          setData(data);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data received</p>;
  return (
    <>
      <Aside_navigation user_first_name={data.user_first_name} user_last_name={data.user_last_name}></Aside_navigation>
      <main className=" col-start-2">
        <FrontPageContent user_avatar={data.user_avatar} setNewFetch={setNewFetch} newFetch={newFetch} />
      </main>
    </>
  );
}
