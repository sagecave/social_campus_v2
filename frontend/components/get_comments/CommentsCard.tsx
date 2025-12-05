import { useEffect, useState } from "react";
type PostCardProps = {
  // post_text: string;
  user_fk: number;
  // user_education?: string;
  // post_created_at: number;
  user_first_name: string;
  // user_last_name?: string;
  // user_id?: number;
  // post_pk: number;
  // setNewFetch: React.Dispatch<React.SetStateAction<boolean>>;
  // newFetch: boolean;
  // user_avatar: string;
  comment_text: string;
};
const CommentsCard = ({ comment_text, user_fk }: PostCardProps) => {
  const [owner, setOnwer] = useState<PostCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postData = await fetch(`http://127.0.0.1:80/comments-owner?user_id=${user_fk}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await postData.json();
        console.log(data, "OWNER COMMENTS");
        setOnwer(data[0]);
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
