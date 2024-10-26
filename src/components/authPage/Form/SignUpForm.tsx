"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z.string().min(8, { message: "영문, 숫자 포함 8자 이상 입력해주세요." }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"]
  });

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onChange", resolver: zodResolver(signInSchema) });

  const onSubmit = (value: FieldValues) => {
    signInSchema.parse(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="email">이메일</label>
        <input
          {...register("email")}
          type="email"
          placeholder="abc@email.com"
          className="border border-gray-500 rounded-md p-2"
        />
        {errors.email && typeof errors.email.message === "string" && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="password">비밀번호</label>
        <input
          {...register("password")}
          type="password"
          placeholder="영문, 숫자 포함 8자 이상"
          className="border border-gray-500 rounded-md p-2"
        />
        {errors.password && typeof errors.password.message === "string" && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="confirm-password">비밀번호</label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="영문, 숫자 포함 8자 이상"
          className="border border-gray-500 rounded-md p-2"
        />
        {errors.confirmPassword && typeof errors.confirmPassword.message === "string" && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <div className="flex justify-center">
        <button type="submit">회원가입</button>
      </div>
    </form>
  );
};

export default SignUpForm;
