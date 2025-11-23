"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 



const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("email", email);
        console.log("password", password);
        
        try{
            const response = await fetch("http://127.0.0.1:80/login-submit", {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),

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
            alert("Login failed");
        }

    };
    
    return ( 
        <form onSubmit={handleSubmit}>
            <label>E-mail</label>
            <input type="text" name="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
            <label>Password</label>
            <input type="text" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" >Login</button>
        </form>
     );
}
 
export default LoginForm;