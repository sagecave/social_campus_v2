"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CommentsModal from "@/components/modal/CommentsModal";
type commentData = {
  post_pk: number;

  // post_text: string;
  // setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  // newFetch: boolean;
};
const Comment = ({ post_pk }: commentData) => {
  const [totalComments, setTotalComments] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:80/post-comments-number?postId=${post_pk}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();
        console.log("COMMENTS", data);
        setTotalComments(data.total_comments);
      } catch (err) {
        console.error("Error during logout:", err);
        alert("like failed");
      }
    };
    loadUserData();
  }, []);

  return (
    <div className=" hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer">
      {isModalOpen && <CommentsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} post_pk={post_pk} />}

      <button className="flex gap-2" onClick={toggleModal} type="submit">
        <Image className=" " src="/message_icon.svg" alt="Picture of the author" width={25} height={25} />
        <p>{totalComments}</p>
      </button>
    </div>
  );
};

export default Comment;
