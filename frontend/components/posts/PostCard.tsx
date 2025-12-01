"use client";
import React, { useState, useEffect } from "react";
type PostCardProps = {
  post_text: string;
  user_fk: number;
  user_first_name: string;
};

const PostCard = ({ post_text, user_fk }: PostCardProps) => {
  const [owner, setOnwer] = useState<PostCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch(`http://127.0.0.1:80/post-owner?owner=${user_fk}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await postData.json();
        setOnwer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [user_fk]);

  if (loading) return <p>Loading...</p>;
  if (!owner) return <p>No data received</p>;
  return (
    <article>
      <h2>{owner.user_first_name}</h2>
      <p>{JSON.stringify(owner.user_fk)}</p>
      <p>{post_text}</p>
    </article>
  );
};

export default PostCard;
