"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import PostContainer from "@/components/posts/PostContainer";
import Aside_navigation from "@/components/navigation/Aside_navigation";
import CreatePost from "@/components/posts/CreatePost";

type UserData = {
  user_first_name: string;
  user_last_name: string;
};
export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const sessionResponse = await fetch("http://127.0.0.1:80/session-check", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const session = await sessionResponse.json();

        if (!session.redirect) {
          router.push("/login");
          return;
        }

        const userData = await fetch("http://127.0.0.1:80/user-data", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const json = await userData.json();
        setData(json);
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
        <CreatePost></CreatePost>
        <section className=" col-start-2">
          <PostContainer />
        </section>
      </main>
    </>
  );
}
