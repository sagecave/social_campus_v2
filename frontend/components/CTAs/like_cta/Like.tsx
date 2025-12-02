import Image from "next/image";
const Link = () => {
  const likePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:80/like-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const data = await response.json();
      console.log("data logout form", data);
    } catch (err) {
      console.error("Error during logout:", err);
      alert("like failed");
    }
  };
  return (
    <div className=" hover:bg-accent-purple-light w-fit  rounded-4xl py-2 px-4 pointer">
      <form className="pointer " onSubmit={likePost}>
        <button className="flex gap-2" type="submit">
          <Image src="/heart_icon.svg" alt="Picture of the author" width={25} height={25} />
          <p>12</p>
        </button>
      </form>
    </div>
  );
};

export default Link;
