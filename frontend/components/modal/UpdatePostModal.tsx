import Image from "next/image";
import { useState, useEffect } from "react";
type modalState = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post_pk: number;
  post_text: string;
};
const UpdatePostModal = ({ setIsModalOpen, isModalOpen, post_pk, post_text }: modalState) => {
  const [postText, setPostText] = useState<string>("");

  useEffect(() => {
    setPostText(post_text);
  }, [post_text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:80/update-post", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postText, post_pk }),
        credentials: "include",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const data = await response.json();
      console.log("data login form", data);
      //   måske redirect so den updatere
      //   router.push(typeof data === "string" ? data : data.redirect ?? "/");
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Post failed");
    }
  };
  return (
    <section className=" relative">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                  bg-inside-border-white border border-border-grey rounded-xl px-4 pt-2 pb-10"
      >
        <h2 className="p-3 text-[1.2rem] font-semibold text-accent-purple">Edit your post</h2>
        <form className="p-4 border-border-grey border-1 rounded-3xl flex flex-col " onSubmit={handleSubmit}>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{ resize: "none" }}
            className=" border-border-grey"
            rows={5}
            cols={53}
            name="createPost"
            id="createPost"
            placeholder="Post an update about your day or studies…"
          ></textarea>
          <button className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
            <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} />
            Update Post
          </button>
          <button onClick={() => setIsModalOpen(!isModalOpen)} className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
            {/* <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} /> */}
            Close
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePostModal;
