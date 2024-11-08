import SignUpForm from "@/components/authPage/form/SignUpForm";

const SignupPage = () => {
  return (
    <div className="-mt-3 flex h-screen flex-col items-center justify-center">
      <div className="flex w-[520px] flex-col items-center rounded-3xl px-10 py-[3.5rem] shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignupPage;
