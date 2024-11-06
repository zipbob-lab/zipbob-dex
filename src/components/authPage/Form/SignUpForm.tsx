"use client";

import { supabase } from "@/supabase/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import AccountSet from "../SignUp/AccountSet";
import UserInfoSet from "../SignUp/UserInfoSet";
import Image from "next/image";
import WhitePen from "@images/penWhite.svg";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const passwordSchema = z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
  message: "영문, 숫자를 포함하여 8자 이상 입력해주세요."
});

const accountSetSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"]
  });

const userInfoSetSchema = z.object({
  profileImage: z
    .any()
    .refine((files) => !files?.[0] || files?.[0]?.size <= MAX_FILE_SIZE, `파일 크기는 5MB 이하여야 합니다.`),
  nickname: z.string().min(2, "2자 이상 입력해주세요.").max(8, "8자 이하로 입력해주세요."),
  introduce: z.string().max(200, "200자 이내로 입력해주세요.")
});

const combinedSchema = z.intersection(accountSetSchema, userInfoSetSchema);

const SignUpForm = () => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null | ArrayBuffer>(null);
  const [isNextForm, setIsNextForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue
  } = useForm({ mode: "onChange", resolver: zodResolver(combinedSchema) });
  const watchProfileImage = watch("profileImage");

  useEffect(() => {
    if (watchProfileImage && watchProfileImage.length > 0) {
      const file = watchProfileImage[0];
      if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    }
  }, [watchProfileImage]);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `userProfileFolder/${fileName}`;

    const { error } = await supabase.storage.from("zipbob_storage").upload(filePath, file);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("zipbob_storage").getPublicUrl(filePath);

    return publicUrl;
  };

  const onNextPage = async () => {
    const formData = getValues();

    try {
      accountSetSchema.parse(formData);

      const { data: existingUser, error: checkError } = await supabase
        .from("USER_TABLE")
        .select("user_id")
        .eq("user_email", formData.email)
        .single();

      if (existingUser) {
        alert("이미 가입된 이메일입니다.");
        return;
      }

      if (checkError && checkError.code !== "PGRST116") {
        // 에러코드 PGRST116 --> 사용자가 데이터베이스에 존재하지 않는다는 것을 의미
        throw checkError;
      }

      setIsNextForm(true);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const onSubmit = async (value: FieldValues) => {
    try {
      userInfoSetSchema.parse(value);

      let avatarUrl = null;
      if (value.profileImage && value.profileImage.length > 0) {
        avatarUrl = await uploadImage(value.profileImage[0]);
      }

      const { error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
          data: {
            password: value.password,
            name: value.nickname,
            avatar_url: avatarUrl,
            introduce: value.introduce
          }
        }
      });

      if (error) throw error;

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <form className="w-full">
      {!isNextForm ? (
        <AccountSet register={register} errors={errors} watch={watch} setValue={setValue} />
      ) : (
        <UserInfoSet
          setPreviewImage={setPreviewImage}
          setValue={setValue}
          isProfileSet={!!watch("profileImage")?.length}
          ACCEPTED_IMAGE_TYPES={ACCEPTED_IMAGE_TYPES}
          previewImage={previewImage}
          register={register}
          errors={errors}
          watch={watch}
        />
      )}
      <div className="mt-[8.625rem] flex justify-center">
        <button
          disabled={
            isNextForm ? !watch("nickname") : !watch("email") || !watch("password") || !watch("confirmPassword")
          }
          type="button"
          className={`mt-8 flex w-full justify-center gap-2 rounded-2xl ${(isNextForm ? watch("nickname") : watch("email") && watch("password") && watch("confirmPassword")) ? "bg-Primary-300" : "bg-Primary-100"} py-3 text-title-16 text-[#FBFBFB]`}
          onClick={isNextForm ? handleSubmit(onSubmit) : onNextPage}
        >
          <Image src={WhitePen} alt="로그인 버튼 이미지" />
          <span className="mr-7">{isNextForm ? "회원가입" : "다음"}</span>
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
