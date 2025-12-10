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
    <article className="flex justify-between my-2">
      <div className="flex gap-4">
        <img className=" rounded-full" src={`${apiUrl}/uploads/${user_avatar}`} alt="Picture of the author" width={50} height={50} />
        <div className="flex">
          <div className="flex flex-col">
            <p className="font-semibold text-[1.25rem] text-black">{user_first_name}</p>
            <p>{user_username}</p>
          </div>
        </div>
      </div>
      <FollowButton unfollow={unfollow} follow={follow} user_pk={user_pk} />
    </article>
  );
};

export default UserCards;
