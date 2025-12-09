import LoginPageContent from "@/components/pageLayout/login_page/LoginPageContent";
import LanSwitcher from "@/components/languages/LanSwitcher";

const login = () => {
  return (
    <main className="col-start-2">
      <LanSwitcher />
      <LoginPageContent />
    </main>
  );
};

export default login;
