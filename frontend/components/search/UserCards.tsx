import FollowButton from "../follow_users/FollowButton";

type User = {
  user_username: string;
  user_avatar: string;
  user_first_name: string;
  user_last_name: string;
  unfollow: string;
  follow: string;
  user_pk: number;
};
const UserCards = ({ user_pk, user_username, user_avatar, user_first_name, user_last_name, unfollow, follow }: User) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return (
    <article>
      <img className="" src={`${apiUrl}/uploads/${user_avatar}`} alt="Picture of the author" width={30} height={30} />
      <p>{user_first_name}</p>
      <p>{user_last_name}</p>
      <p>{user_username}</p>
      <FollowButton unfollow={unfollow} follow={follow} user_pk={user_pk} />
    </article>
  );
};

export default UserCards;
