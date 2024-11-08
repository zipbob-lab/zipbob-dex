import { UserInfoSetProps } from "@/types/Auth";
import Image from "next/image";
import React from "react";
import InputField from "../InputField";
import DefaultProfile from "@images/default-profile.svg";
import ImageButton from "@images/imageButton.svg";

const UserInfoSet = ({
  ACCEPTED_IMAGE_TYPES,
  previewImage,
  register,
  errors,
  isProfileSet,
  setPreviewImage,
  setValue,
  watch
}: UserInfoSetProps) => {
  console.log(isProfileSet);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative">
          <input
            {...register("profileImage")}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
          />
          <div className="h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full bg-gray-300">
            {previewImage ? (
              <Image
                src={previewImage.toString()}
                width={120}
                height={120}
                alt="프로필 사진"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image src={DefaultProfile} alt="기본 프로필" />
            )}
          </div>
          <Image src={ImageButton} alt="이미지 드롭박스 버튼" className="absolute bottom-0 right-0" />
        </div>
        <div className="mt-3 h-[0.875rem] text-Primary-300">
          {isProfileSet && (
            <button
              type="button"
              onClick={() => {
                setPreviewImage("");
                setValue("profileImage", null);
              }}
            >
              사진 제거
            </button>
          )}
        </div>
        <div className="mt-4 h-3">
          {errors.profileImage && (
            <p className="text-body-12 text-SystemColor-Red">{errors.profileImage.message?.toString()}</p>
          )}
        </div>
      </div>
      <InputField
        register={register}
        label="닉네임"
        name="nickname"
        placeholder="2자 이상 8자 이하로 입력해주세요."
        type="text"
        errors={errors}
        isEmpty={!watch("nickname")}
        setValue={setValue}
      />
      <InputField
        register={register}
        label="자기소개(선택)"
        name="introduce"
        placeholder="200자 이내로 입력해주세요."
        type="text"
        errors={errors}
        isEmpty={!watch("introduce")}
        setValue={setValue}
      />
    </>
  );
};

export default UserInfoSet;
