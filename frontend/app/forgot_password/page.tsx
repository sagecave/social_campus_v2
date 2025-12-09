import ForgotPageContent from "@/components/pageLayout/forgot_page/ForgotPageContent";
import LanSwitcher from "@/components/languages/LanSwitcher";

const forgot_password = () => {
  return (
    <main className=" col-start-2">
      <LanSwitcher />
      <ForgotPageContent />
    </main>
  );
};

export default forgot_password;
