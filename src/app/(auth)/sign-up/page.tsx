import SignUpForm from "@/components/authPage/Form/SignUpForm";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[2rem]">회원가입</h1>
      <SignUpForm />
    </div>
  );
};

export default SignupPage;
