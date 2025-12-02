import Link from "next/link";
import Image from "next/image";
import LogoutForm from "../auth-modules/logout/LogoutForm";
const Aside_navigation = () => {
  return (
    <nav className=" col-start-1 p-4 border-r-1 border-border-grey">
      <header className="flex gap-2 items-center">
        <Image src="/socialCampus_logo.png" alt="Picture of the author" width={50} height={50} />
        <h1 className="text-accent-purple text-[1.2rem] font-bold">Social campus</h1>
      </header>
      <ul className="mt-6 flex flex-col gap-2">
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem]" href="/">
            <Image src="/home.svg" alt="Picture of the author" width={30} height={30} /> Home
          </Link>
        </li>
        <li className="flex gap-2  hover:bg-accent-purple-light-white rounded-2xl  px-4 py-2  font-medium text-button-text">
          <Link className="flex gap-2 text-[1.2rem]" href="/profile">
            <Image src="/profile.svg" alt="Picture of the author" width={30} height={30} /> Profile
          </Link>
        </li>

        <li className="mt-6">
          <LogoutForm></LogoutForm>
        </li>
      </ul>
    </nav>
  );
};

export default Aside_navigation;
