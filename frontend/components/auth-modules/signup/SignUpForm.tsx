
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
        <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input type="text" name="username" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <label>Email</label>
            <input type="text" name="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
            <label>First name</label>
            <input type="text" name="firstname" value={firstName} placeholder="First name" onChange={e => setFirstName(e.target.value)} />
            <label>Last name</label>
            <input type="text" name="lastname" value={lastName} placeholder="Last name" onChange={e => setLastName(e.target.value)} />
            <label>Education</label>
            <input type="text" name="education" value={education} placeholder="Education" onChange={e => setEducation(e.target.value)} />
            <label>Shcool</label>
            <input type="text" name="shcool" value={shcool} placeholder="Shcool" onChange={e => setSchool(e.target.value)} />
            <label>Password</label>
            <input type='text' name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            <button type="submit" >Sign Up</button>
        </form>
     );
}
 
export default SignUpForm;