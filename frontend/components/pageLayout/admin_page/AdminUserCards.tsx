import BlockUnblockUser from "@/components/CTAs/blockAndUnblock/BlockUnblockUser";
import BlockUnblockPost from "@/components/CTAs/blockAndUnblock/BlockUnblockPost";
type userData = {
  user_username: string;
  user_avatar: string;
  user_first_name: string;
  user_last_name: string;
  user_pk: number;
  user_email: string;
  user_role: string;
  user_block_status: string;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAgain: boolean;
};
const AdminUserCards = ({ fetchAgain, setFetchAgain, user_block_status, user_role, user_pk, user_email, user_username, user_avatar, user_first_name, user_last_name }: userData) => {
  return (
    <article className="flex gap-10  ">
      <img src={`http://127.0.0.1/uploads/${user_avatar}`} alt="pic" width={30} height={30} />
      <div className="flex flex-col">
        <h2 className=" font-semibold">User id</h2>
        <p>{user_pk}</p>
      </div>

      <div className="flex flex-col">
        <h2 className=" font-semibold">Username</h2>
        <p>{user_username}</p>
      </div>
      <div className="flex flex-col">
        <h2 className=" font-semibold">User role</h2>
        <p>{user_role}</p>
      </div>

      <BlockUnblockUser user_email={user_email} user_pk={user_pk} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} user_block_status={user_block_status} />
      {/* <BlockUnblockPost /> */}
    </article>
  );
};

export default AdminUserCards;
