import Image from "next/image";
import { useState } from "react";
type postData = {
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;
};
const CreatePost = ({ setNewFetch, newFetch }: postData) => {
  const [postText, setPostText] = useState<string>("");

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
    } finally {
      setNewFetch(!newFetch);
      console.log(newFetch, "new fetch true or falsk");
    }
  };
  return (
    <section className="justify-self-center mt-10 ">
      <form className="p-4 border-border-grey border-1 rounded-3xl flex flex-col " onSubmit={handleSubmit}>
        <textarea onChange={(e) => setPostText(e.target.value)} style={{ resize: "none" }} className=" border-border-grey" rows={5} cols={53} name="createPost" id="createPost" placeholder="Post an update about your day or studies…"></textarea>
        <button className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
          <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} />
          Post
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
