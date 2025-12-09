"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Aside_navigation from "@/components/navigation/Aside_navigation";
import ProfilePasswordPage from "@/components/pageLayout/profile_page/ProfilePasswordPage";

type UserData = {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_username: string;
  user_avatar: string;
};

const Profile = () => {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //   const [newFetch, setNewFetch] = useState(true);
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

        const response = await fetch(`${apiUrl}/user-data`, {
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
          const json = await response.json();

          setData(json);
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
        <ProfilePasswordPage user_avatar={data.user_avatar} user_first_name={data.user_last_name} user_last_name={data.user_last_name} user_email={data.user_email} user_username={data.user_username} />
      </main>
    </>
  );
};

export default Profile;
