"use client";
import Image from "next/image";

type postData = {
  post_pk: number;
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;
};
const DeletePost = ({ post_pk, setNewFetch, newFetch }: postData) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const deletingPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/delete-post?post_id=${post_pk}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
      }
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setNewFetch(!newFetch);
    }
  };
  return (
    <div className=" hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer">
      <form className="pointer " onSubmit={deletingPost}>
        <button className="flex gap-2" type="submit">
          <Image className=" " src="/delete.svg" alt="Picture of the author" width={25} height={25} />
          {/* <p>Delete page</p> */}
        </button>
      </form>
    </div>
  );
};

export default DeletePost;
