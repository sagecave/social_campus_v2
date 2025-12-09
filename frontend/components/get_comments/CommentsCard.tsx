import { useEffect, useState } from "react";
type PostCardProps = {
  // post_text: string;
  user_fk: number;
  // user_education?: string;
  // post_created_at: number;

  // user_last_name?: string;
  // user_id?: number;
  // post_pk: number;
  // setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  // newFetch: boolean;
  // user_avatar: string;
  comment_text: string;
};
type userData = {
  user_first_name: string;
};
const CommentsCard = ({ comment_text, user_fk }: PostCardProps) => {
  const [owner, setOnwer] = useState<userData | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch(`${apiUrl}/comments-owner?user_id=${user_fk}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!postData.ok) {
          const data = await postData.json();
          console.warn("Signup error:", data);
          alert(data.status);
        }
        if (postData.ok) {
          const data = await postData.json();
          console.log(data, "OWNER COMMENTS");
          setOnwer(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!owner) return <p>No data received</p>;
  return (
    <div>
      <p>{owner.user_first_name}</p>
      <p>{comment_text}</p>
    </div>
  );
};

export default CommentsCard;
