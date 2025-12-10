"use client";
import { useState } from "react";
import Image from "next/image";
import UpdatePostModal from "@/components/modal/UpdatePostModal";

type postData = {
  post_pk: number;
  post_text: string;
  setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  newFetch: boolean;

  edit_post: string;
  update_post: string;
  close: string;
};

const UpdatePost = ({ post_pk, post_text, setNewFetch, newFetch, edit_post, update_post, close }: postData) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className=" hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer">
      {isModalOpen && <UpdatePostModal edit_post={edit_post} update_post={update_post} close={close} setNewFetch={setNewFetch} newFetch={newFetch} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} post_pk={post_pk} post_text={post_text} />}
      {/* <form className="pointer " onSubmit={updateModalPost}> */}
      <button className="flex gap-2 pointer" onClick={toggleModal} type="submit">
        <Image className=" " src="/edit.svg" alt="Picture of the author" width={25} height={25} />
        {/* <p>Edit page</p> */}
      </button>
      {/* </form> */}
    </div>
  );
};

export default UpdatePost;
