"use client";
import { useState } from "react";
import Image from "next/image";
// import { stringify } from "querystring";
import CommentsContainer from "../get_comments/CommentsContainer";
type commentData = {
  post_pk: number;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: string;
  make_comment: string;
  close: string;

  // post_text: string;
  // setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  // newFetch: boolean;
};
const CommentsModal = ({ post_pk, isModalOpen, setIsModalOpen, post, make_comment, close }: commentData) => {
  const [postText, setPostText] = useState<string>("");
  const [newFetch, setNewFetch] = useState(true);
  //   useEffect(() => {
  //     setPostText(post_text);
  //   }, [post_text]);

  const commentPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // skal post text op til databasen
    try {
      const response = await fetch("http://127.0.0.1:80/post-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_pk, postText }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        console.warn("Signup error:", data);
        alert(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        console.log("data logout form", data);
        setPostText("");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("like failed");
    } finally {
      setNewFetch(!newFetch);
    }
  };
  return (
    <section className=" relative">
      <div
        className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                   bg-inside-border-white border border-border-grey rounded-xl px-4 pt-2 pb-10"
      >
        <h2 className="p-3 text-[1.2rem] font-semibold text-accent-purple">{make_comment}</h2>

        <div>
          <CommentsContainer post_pk={post_pk} newFetch={newFetch} />
        </div>
        <form className="p-4 border-border-grey border-1 rounded-3xl flex flex-col " onSubmit={commentPost}>
          <textarea onChange={(e) => setPostText(e.target.value)} value={postText} style={{ resize: "none" }} className=" border-border-grey" rows={2} cols={53} name="createPost" id="createPost" placeholder={make_comment}></textarea>
          <div className="flex gap-2 flex-row-reverse">
            <button className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
              <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} />
              {post}
            </button>
            <button onClick={() => setIsModalOpen(!isModalOpen)} className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
              {close}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CommentsModal;
