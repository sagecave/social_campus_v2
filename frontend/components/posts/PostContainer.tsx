"use client";
import PostCard from "./PostCard";
import React, { useState, useEffect } from "react";

type PostCardProps = {
  post_text: string;
  user_id: number;
  user_fk: number;
  post_created_at: number;
  user_first_name: string;
};
const Post_container = () => {
  const [data, setData] = useState<PostCardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch("http://127.0.0.1:80/posts", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const json = await postData.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data received</p>;

  return (
    <section className="justify-self-center">
      {data.map((data, i) => (
        <PostCard key={i} post_text={data.post_text} user_fk={data.user_fk} post_created_at={data.post_created_at} />
      ))}
    </section>
  );
};

export default Post_container;
