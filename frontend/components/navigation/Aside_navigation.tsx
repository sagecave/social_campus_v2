"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutForm from "../auth-modules/logout/LogoutForm";
import SearchUser from "../modal/SearchUser";

type userData = {
  user_first_name: string;
  user_last_name: string;
};
type modalStatus = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Aside_navigation = ({ user_first_name, user_last_name }: userData) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <nav className=" col-start-1 p-4 border-r-1 border-border-grey">
      <header className="flex gap-2 items-center">
        <Image src="/socialCampus_logo.png" alt="Picture of the author" width={50} height={50} />
        <h1 className="text-accent-purple text-[1.2rem] font-bold">Social campus</h1>
      </header>
      <ul className="mt-6 flex flex-col gap-2">
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem] w-full h-full" href="/">
            <Image src="/home.svg" alt="Picture of the author" width={30} height={30} /> Home
          </Link>
        </li>
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <button
            className="flex gap-2 text-[1.2rem] w-full h-full"
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <Image src="/search.svg" alt="Picture of the author" width={30} height={30} /> Search
          </button>
        </li>
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem] capitalize w-full h-full" href="/profile">
            <Image src="/profile.svg" alt="Picture of the author" width={30} height={30} />
            {/* <img className=" rounded-full" src={`http://127.0.0.1/uploads/${user_avatar}`} alt="profil billede" width={50} height={50} /> */}
            {user_first_name} {user_last_name}
          </Link>
        </li>

        {modalOpen ? <SearchUser setModalOpen={setModalOpen} modalOpen={modalOpen} /> : <></>}
        <li className="mt-6">
          <LogoutForm></LogoutForm>
        </li>
      </ul>
    </nav>
  );
};

export default Aside_navigation;
