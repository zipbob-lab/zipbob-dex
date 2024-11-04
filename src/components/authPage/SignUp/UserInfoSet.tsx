import { UserInfoSetProps } from "@/types/auth";
import Image from "next/image";
import React from "react";
import InputField from "../InputField";

const UserInfoSet = ({ ACCEPTED_IMAGE_TYPES, previewImage, register, errors }: UserInfoSetProps) => {
  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <div className="relative w-20 h-20">
          <input
            {...register("profileImage")}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="bg-gray-300 w-20 h-20 rounded-full overflow-hidden">
            {previewImage ? (
              <Image
                src={previewImage.toString()}
                width={80}
                height={80}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">+</div>
            )}
          </div>
        </div>
        {errors.profileImage && <p className="text-red-500">{errors.profileImage.message?.toString()}</p>}
      </div>
      <InputField
        register={register}
        label="닉네임"
        name="nickname"
        placeholder="2자 이상 8자 이하로 입력해주세요."
        type="text"
        errors={errors}
      />
      <InputField
        register={register}
        label="자기소개(선택)"
        name="introduce"
        placeholder="200자 이내로 입력해주세요."
        type="text"
        errors={errors}
      />
    </>
  );
};

export default UserInfoSet;
