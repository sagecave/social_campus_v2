"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/profile_form/ProfileForm";
import Aside_navigation from "@/components/navigation/Aside_navigation";
import DeleteProfile from "@/components/CTAs/delete_account/DeleteAccount";

type UserData = {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_username: string;
};

const Profile = () => {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  //   const [newFetch, setNewFetch] = useState(true);
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
        <section>
          <h1>profile</h1>
          <ProfileForm user_first_name={data.user_first_name} user_last_name={data.user_last_name} user_email={data.user_email} user_username={data.user_username}></ProfileForm>
          <DeleteProfile />
        </section>
      </main>
    </>
  );
};

export default Profile;
