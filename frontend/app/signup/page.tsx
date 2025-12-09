import SignupPageContent from "@/components/pageLayout/signup_page/SignupPageContent";
import LanSwitcher from "@/components/languages/LanSwitcher";

const signupForm = () => {
  return (
    <main className="col-start-2">
      <LanSwitcher />
      <SignupPageContent />
    </main>
  );
};

export default signupForm;
