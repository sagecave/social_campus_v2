"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Like from "@/components/CTAs/like_cta/Like";
import Comment from "@/components/CTAs/comment_cta/Comment";
type PostCardProps = {
  post_text: string;
  user_fk: number;
  user_education?: string;
  post_created_at: number;
  user_first_name?: string;
  user_last_name?: string;
  user_id?: number;
};

const PostCard = ({ post_text, user_fk, post_created_at }: PostCardProps) => {
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

  let options: Intl.DateTimeFormatOptions;

  if (post_created_at < 86400000) {
    options = {
      hour: "2-digit",
      minute: "2-digit",
    };
  } else {
    options = {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
  }
  const readable = new Date(post_created_at * 1000).toLocaleTimeString([], options);

  if (loading) return <p>Loading...</p>;
  if (!owner) return <p>No data received</p>;
  return (
    <article className="flex flex-col gap-4 p-4 max-w-[500px] min-w-[320px]">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Image className=" rounded-b-full" src="/socialCampus_logo.png" alt="Picture of the author" width={30} height={30} />
          <div>
            <p className=" text-[1rem] text-postname">
              {owner.user_first_name} {owner.user_last_name}
            </p>
            <p className="text-[0.75rem] text-label-dark-gray">{owner.user_education}</p>
          </div>
        </div>
        <p className="text-[0.75rem] text-label-dark-gray">{readable}</p>
      </div>

      <p>{post_text}</p>
      <div className="flex gap-2">
        <Like />
        <Comment />
      </div>
    </article>
  );
};

export default PostCard;
