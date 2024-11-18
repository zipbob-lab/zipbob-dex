import SignUpForm from "@/components/authPage/Form/SignUpForm";

const SignupPage = () => {
  return (
    <div className="-mt-3 flex h-screen flex-col items-center justify-center">
      <div className="flex w-[20.9rem] flex-col items-center md:w-[27.5rem] lg:w-[32.5rem] lg:rounded-3xl lg:px-[2.5rem] lg:py-[3.5rem] lg:shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignupPage;
