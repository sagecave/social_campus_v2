"use client";
import SignUpForm from "@/components/auth-modules/signup/SignUpForm";
import Link from "next/link";
import Image from "next/image";


const signupForm = () => {
    return ( 
        <section className='flex flex-col items-center justify-center  w-full h-screen'>
            <Image
                src="/socialCampus_logo.png"
                width={100}
                height={100}
                alt="Picture of the author">
        
            </Image>
            <h1 className=" text-[2.5rem] font-bold text-center text-text-dark-gray">Be part of<br></br><span className=" text-accent-purple text-[3rem] ">Social campus</span></h1>
            <SignUpForm></SignUpForm>
             <div className='flex flex-row gap-1 mt-6'>
                <p className="text-link-light-gray font-semibold">Already have an account?</p>
                <Link className=" text-accent-purple font-semibold underline underline-offset-4 hover:text-accent-red" href="/login">Login</Link>
            </div>
        </section>
     );
}
 
export default signupForm;