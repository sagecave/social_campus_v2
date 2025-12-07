type User = {
  user_username: string;
  user_avatar: string;
  user_first_name: string;
  user_last_name: string;
};
const UserCards = ({ user_username, user_avatar, user_first_name, user_last_name }: User) => {
  return (
    <article>
      <img className="" src={`http://127.0.0.1/uploads/${user_avatar}`} alt="Picture of the author" width={30} height={30} />
      <p>{user_first_name}</p>
      <p>{user_last_name}</p>
      <p>{user_username}</p>
    </article>
  );
};

export default UserCards;
