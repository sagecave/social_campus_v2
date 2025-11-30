"use client";
import Reset_password from "@/components/auth-modules/reset_password/Reset_password";
import Image from "next/image";
const login = () => {
  return (
    <section className="flex flex-col items-center justify-center  w-full h-screen">
      <Image src="/socialCampus_logo.png" width={100} height={100} alt="Picture of the author"></Image>

      <h1 className=" text-[2.5rem] font-bold text-center text-text-dark-gray">
        Forgot your password? <br></br>
        <span className=" text-accent-purple text-[3rem] ">Change it here</span>
      </h1>
      <Reset_password></Reset_password>
    </section>
  );
};

export default login;
