import Image from "next/image";
import { useState, useEffect } from "react";
import ErrorHandlingModal from "@/components/modal/ErrorHandlingModal";
type modalState = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post_pk: number;
  post_text: string;
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;

  edit_post: string;
  update_post: string;
  close: string;
};
const UpdatePostModal = ({ setIsModalOpen, isModalOpen, post_pk, post_text, setNewFetch, newFetch, update_post, edit_post, close }: modalState) => {
  const [postText, setPostText] = useState<string>("");
  const [errorMessageGet, setErrorMessageGet] = useState<string>("");

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
        const data = await response.json();
        console.warn("Signup error:", data);

        setErrorMessageGet(data.status);
      }
      if (response.ok) {
        const data = await response.json();
        console.log("data login form", data);
        setPostText("");
        setErrorMessageGet(data.status);
        //   måske redirect so den updatere
        //   router.push(typeof data === "string" ? data : data.redirect ?? "/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      // Make alert to a user-friendly notification in the future
    } finally {
      setNewFetch(!newFetch);
      setIsModalOpen(!isModalOpen);
    }
  };
  return (
    <section className=" relative">
      <ErrorHandlingModal errorMessageGet={errorMessageGet} setErrorMessageGet={setErrorMessageGet} />
      <div
        className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                  bg-inside-border-white border border-border-grey rounded-xl px-4 pt-2 pb-10"
      >
        <h2 className="p-3 text-[1.2rem] font-semibold text-accent-purple">{edit_post}</h2>
        <form className="p-4 border-border-grey border-1 rounded-3xl flex flex-col " onSubmit={handleSubmit}>
          <textarea onChange={(e) => setPostText(e.target.value)} value={postText} style={{ resize: "none" }} className=" border-border-grey" rows={5} cols={53} name="createPost" id="createPost" placeholder={edit_post}></textarea>
          <button className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
            <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} />
            {update_post}
          </button>
          <button onClick={() => setIsModalOpen(!isModalOpen)} className="border-1 self-end w-fit bg-inside-border-white border-border-grey bottom-4 right-4 flex gap-2 hover:bg-accent-purple-light-white py-2 px-4 rounded-3xl items-center mt-2">
            {/* <Image className="" src="/sendPost.svg" alt="Picture of the author" width={30} height={30} /> */}
            {close}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePostModal;
