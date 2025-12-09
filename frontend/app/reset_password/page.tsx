import ResetPasswordPage from "@/components/pageLayout/reset_password_page/ResetPasswordPage";
import LanSwitcher from "@/components/languages/LanSwitcher";

const login = () => {
  return (
    <main className=" col-start-2">
      <LanSwitcher />
      <ResetPasswordPage />
    </main>
  );
};

export default login;
