import Image from "next/image";
import { useState } from "react";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type postData = {
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;
  post: string;
  post_update_placeholder: string;
};
const CreatePost = ({ setNewFetch, newFetch, post, post_update_placeholder }: postData) => {
  const [postText, setPostText] = useState<string>("");
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:80/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postText }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        setErrorMessageGet(data.status);
      }

      //   måske redirect so den updatere
      //   router.push(typeof data === "string" ? data : data.redirect ?? "/");
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
      alert("Post failed");
    } finally {
      setNewFetch(!newFetch);
      console.log(newFetch, "new fetch true or falsk");
    }
  };
  return (
    <section className="justify-self-center mt-10 ">
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <form className="p-4 border-border-grey border-1 rounded-3xl flex flex-col " onSubmit={handleSubmit}>
        <textarea onChange={(e) => setPostText(e.target.value)} style={{ resize: "none" }} className=" border-border-grey" rows={5} cols={53} name="createPost" id="createPost" placeholder={post_update_placeholder}></textarea>
        <button className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
          <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} />
          {post}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
