"use client";
import AdminUserCards from "./AdminUserCards";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type PostCardProps = {
  user_avatar: string;
  user_block_status: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_pk: number;
  user_role: string;
  user_username: string;
};
const AdminControlPanel = () => {
  const [data, setData] = useState<PostCardProps[] | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchAgain, setFetchAgain] = useState<boolean>(true);
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch(`${apiUrl}/admin-users`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!postData.ok) {
          const data = await postData.json();
          console.log(data);
          console.warn("Signup error:", data);
          setErrorMessageGet(data.status);
          if (!data.redirect) {
            router.push("/");
            return;
          }
        }
        if (postData.ok) {
          const json = await postData.json();
          setData(json);
          //   if (!json.redirect) {
          //     router.push("/");
          //     return;
          //   }
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [fetchAgain]);
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data received</p>;
  return (
    <div>
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <h2>Container for cards</h2>
      {data.map((data, i) => (
        <AdminUserCards
          key={i}
          user_role={data.user_role}
          user_email={data.user_email}
          user_pk={data.user_pk}
          user_last_name={data.user_last_name}
          user_first_name={data.user_first_name}
          user_username={data.user_username}
          user_avatar={data.user_avatar}
          user_block_status={data.user_block_status}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
        />
      ))}
    </div>
  );
};

export default AdminControlPanel;
