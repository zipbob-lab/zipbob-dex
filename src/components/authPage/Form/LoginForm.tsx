import browserClient from "@/supabase/client";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";

const LoginForm = () => {
  const { register, handleSubmit } = useForm({ mode: "onChange" });
  const router = useRouter();

  const handleLogin = async (value: FieldValues) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password
      });

      if (error) throw error;
      alert("로그인 되었습니다.");
      browserClient.auth.setSession(data.session);
      router.push("/");
    } catch (error) {
      console.error("로그인 실패 : ", (error as Error).message);
      alert("이메일 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <form className="flex flex-col gap-4 mb-2" onSubmit={handleSubmit(handleLogin)}>
      <h1 className="text-[2rem]">일반 로그인</h1>
      <input
        {...register("email")}
        type="email"
        placeholder="이메일"
        className="border border-gray-500 rounded-md p-1"
      />
      <input
        {...register("password")}
        type="password"
        placeholder="비밀번호"
        className="border border-gray-500 rounded-md p-1"
      />
      <button>로그인</button>
    </form>
  );
};

export default LoginForm;
