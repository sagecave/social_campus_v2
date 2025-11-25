

import {useRouter} from "next/navigation";

const LogoutForm = () => {

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const response = await fetch("http://127.0.0.1:80/logout-submit",{
                method: "POST",
                headers:{"Content-Type": "application/json"},
                credentials: "include",
            });

            if (!response.ok){
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`); 
            }
            const data = await response.json();
            console.log("data logout form", data); 
            router.push(typeof data === "string" ? data : (data.redirect ?? "/"));

        }catch (err){
            console.error("Error during logout:", err);
            alert("Logout failed");
        }

    }

    return ( 
        <form onSubmit={handleSubmit}>
            <button type="submit" >Logout</button>
        </form>
     );
}
 
export default LogoutForm;