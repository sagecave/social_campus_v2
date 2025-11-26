
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const SignUpForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [education, setEducation] = useState<string>("");
    const [shcool, setSchool] = useState<string>("");

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try{
            const response = await fetch("http://127.0.0.1:80/signup-submit",{
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({email, password,username, firstName, lastName, education, shcool}),
                credentials: "include",

            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);
            }
            const data = await response.json();
            console.log("data login form", data);
            router.push(typeof data === "string" ? data : (data.redirect ?? "/"));
        
        } catch (err){
            console.error("Error during login:", err);
            // Make alert to a user-friendly notification in the future
            alert("Sign Up failed");
        }
        
    } 
    return ( 
        <form className="flex flex-col justify-self-center w-[inherit] max-w-160 gap-4 place-items-center" onSubmit={handleSubmit}>
          
            <div className="flex flex-col w-full">
                <label className="text-label-dark-gray font-bold">Username</label>
                <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type="text" name="username" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="flex flex-col w-full">
                <label className="text-label-dark-gray font-bold">Email</label>
                <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type="text" name="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
            </div>
      
             <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col w-full">
                    <label className="text-label-dark-gray font-bold">First name</label>
                    <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type="text" name="firstname" value={firstName} placeholder="First name" onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-label-dark-gray font-bold">Last name</label>
                    <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type="text" name="lastname" value={lastName} placeholder="Last name" onChange={e => setLastName(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col w-full">
                    <label className="text-label-dark-gray font-bold">Education</label>
                    <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type="text" name="education" value={education} placeholder="Education" onChange={e => setEducation(e.target.value)} />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-label-dark-gray font-bold">Shcool</label>
                    <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type="text" name="shcool" value={shcool} placeholder="Shcool" onChange={e => setSchool(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <label className="text-label-dark-gray font-bold">Password</label>
                <input className=" px-4 py-6 bg-inside-border-white border-2 rounded-border-form border-border-light-gray h-12 placeholder:text-light-gray caret-accent-purple w-full" type='text' name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            </div>            
            <button className="bg-linear-to-r w-auto from-accent-purple to-accent-red rounded-full px-24 py-4 mt-6 text-inside-border-white font-bold text-[1.5rem] bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-500"  type="submit" >Sign Up</button>
        </form>
     );
}
 
export default SignUpForm;