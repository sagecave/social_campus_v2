"use client";
import PostCard from "./PostCard";
import React, { useState, useEffect } from "react";

type PostCardProps = {
  post_text: string;
  user_id: number;
  user_fk: number;
  post_created_at: number;
  user_first_name: string;
  post_pk: number;
};
type PostContainerProps = {
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;
  user_avatar: string;
  update_post: string;
  make_comment: string;
  edit_post: string;
  close: string;
  post: string;
};
const Post_container = ({ newFetch, setNewFetch, user_avatar, update_post, make_comment, edit_post, post, close }: PostContainerProps) => {
  const [data, setData] = useState<PostCardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch(`${apiUrl}/posts`, {
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
        <PostCard
          key={i}
          update_post={update_post}
          make_comment={make_comment}
          edit_post={edit_post}
          post={post}
          user_avatar={user_avatar}
          setNewFetch={setNewFetch}
          newFetch={newFetch}
          post_text={data.post_text}
          user_fk={data.user_fk}
          post_created_at={data.post_created_at}
          post_pk={data.post_pk}
          close={close}
        />
      ))}
    </section>
  );
};

export default Post_container;
