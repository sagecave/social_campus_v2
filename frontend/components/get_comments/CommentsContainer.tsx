"use client";
import React, { useState, useEffect } from "react";
import CommentsCard from "@/components/get_comments/CommentsCard";
type PostCardProps = {
  // post_text: string;
  // user_id: number;
  user_fk: number;
  // post_created_at: number;
  // user_first_name: string;
  comment_text: string;
};
type PostContainerProps = {
  // setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  // newFetch: boolean;
  // user_avatar: string;
  post_pk: number;
  newFetch: boolean;
};

const CommentsContainer = ({ post_pk, newFetch }: PostContainerProps) => {
  const [data, setData] = useState<PostCardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch(`${apiUrl}/comments?post_id=${post_pk}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!postData.ok) {
          const data = await postData.json();
          console.warn("Signup error:", data);
          alert(data.status);
        }
        if (postData.ok) {
          const json = await postData.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        console.log(data);
        setLoading(false);
      }
    };
    loadPosts();
  }, [newFetch]);
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data received</p>;
  return (
    <section className="justify-self-center">
      {data.map((data, i) => (
        <CommentsCard key={i} comment_text={data.comment_text} user_fk={data.user_fk} />
        // <CommentsCard key={i} user_avatar={user_avatar} setNewFetch={setNewFetch} newFetch={newFetch} user_fk={data.user_fk} post_pk={data.post_pk} />
      ))}
    </section>
  );
};

export default CommentsContainer;
