import browserClient from "@/supabase/client";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import Link from "next/link";

const LoginForm = () => {
  const { register, handleSubmit } = useForm({ mode: "onChange" });
  const router = useRouter();

  const handleLogin = async (value: FieldValues) => {
    if (!value.email) {
      alert("이메일을 입력해주세요");
      return;
    } else if (!value.password) {
      alert("비밀번호를 입력해주세요");
      return;
    }
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
    <form className="flex w-full flex-col items-center" onSubmit={handleSubmit(handleLogin)}>
      <div className="flex w-full flex-col gap-3">
        <input
          {...register("email")}
          type="email"
          placeholder="이메일"
          className="rounded-xl border border-Gray-100 px-4 py-3 text-body-16 text-Gray-500"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          className="rounded-xl border border-Gray-100 px-4 py-3 text-body-16 text-Gray-500"
        />
      </div>
      <button className="mt-8 flex w-full justify-center rounded-2xl bg-Primary-300 py-3 text-title-16 text-[#FBFBFB]">
        <span>로그인</span>
      </button>
      <Link href="/sign-up" className="mt-2 px-2 py-3 text-[0.875rem] font-medium tracking-[0.5px]">
        회원가입
      </Link>
    </form>
  );
};

export default LoginForm;
