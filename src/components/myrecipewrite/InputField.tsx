"use client";

import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

enum RecipeMethodEnum {
  boil = "끓이기",
  roast = "굽기",
  frying = "튀기기",
  steaming = "찌기",
  other = "기타"
}

enum RecipeTypeEnum {
  bob = "밥",
  desert = "디저트",
  other = "기타"
}

interface IFormInput {
  recipeMethod: RecipeMethodEnum;
  recipeType: RecipeTypeEnum;
  recipeTitle: string;
  recipeDescription: string;
  ingredient: string;
  amount: number;
  unit: string;
  recipeManual: string;
}

const InputField = () => {
  const [recipeDoingImgFile, setRecipeDoingImgFile] = useState(null);
  const [recipeDoingImgView, setRecipeDoingImgView] = useState(null);

  const {
    register,
    handleSubmit
    // watch,
    // formState: { errors }
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // 이미지 업로드
    let recipeDoingImgUrl = null;
    if (recipeDoingImgFile) {
      //한글파일명 업로드를 위해 파일명 변경
      const lastDot = recipeDoingImgFile.name.lastIndexOf(".");
      const fileExtension = recipeDoingImgFile.name.substring(lastDot + 1);
      const newFileName = Math.random().toString(36).substr(2, 11);
      const uniqueImgName = new Date().getTime();
      const imgFileName = `${uniqueImgName}_${newFileName}`;

      const { imgData, imgError } = await supabase.storage
        .from("zipbob_storage")
        .upload(`recipeDoingImgFolder/${imgFileName}.${fileExtension}`, recipeDoingImgFile);

      if (imgError) {
        alert("업로드 실패");
        return;
      } else {
        recipeDoingImgUrl = `https://lluyiezkzctkdodxpefi.supabase.co/storage/v1/object/public/zipbob_storage/recipeDoingImgFolder/${imgFileName}.${fileExtension}`;
      }
    }
    console.log("제출된 데이터:", data);
    console.log("업로드된 이미지 URL:", recipeDoingImgUrl);
  };

  const handleAddIngredients = () => {
    alert("재료추가버튼누름");
  };

  // 이미지 선택
  const handleFileSelect = (event) => {
    const selectedImg = event.target.files[0];
    setRecipeDoingImgFile(selectedImg);

    if (selectedImg) {
      const imgReader = new FileReader();
      imgReader.readAsDataURL(selectedImg);
      imgReader.onloadend = () => {
        setRecipeDoingImgView(imgReader.result);
      };
    }
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <h1 className="text-2xl">나만의 레시피 등록하기</h1>
          <span>레시피 등록에 대한 간단한 설명</span>
        </div>

        {/* 요리정보 */}
        <div className=" bg-slate-200 p-5">
          <div className="flex mb-5 gap-10">
            <label className="font-bold">카테고리</label>
            <select {...register("recipeMethod", { required: true })}>
              <option value="boil">끓이기</option>
              <option value="roast">굽기</option>
              <option value="frying">튀기기</option>
              <option value="steaming">찌기</option>
              <option value="other">기타</option>
            </select>
            <select {...register("recipeType", { required: true })}>
              <option value="bob">밥</option>
              <option value="desert">디저트</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div className="flex mb-5 gap-10">
            <label className="font-bold">레시피 제목</label>
            <input placeholder="예)바질 로제 파스타" {...register("recipeTitle", { required: true })} />
          </div>
          <div className="flex mb-5 gap-10">
            <label className="font-bold">요리 소개</label>
            <textarea
              placeholder="레시피의 탄생배경, 특징을 적어주세요."
              {...(register("recipeDescription"), { required: true })}
            />
          </div>
        </div>

        {/* 재료정보 */}
        <div className="flex flex-col bg-pink-200 p-5 gap-1">
          <label className="font-bold">재료 정보</label>
          <span>레시피를 보고 요리하는 사용자들을 위해 계량정보를 정확하게 입력해주세요.</span>
          <div className="flex gap-5">
            <input placeholder="예)양상추" {...register("ingredient", { required: true })} />
            <input placeholder="수량" {...register("amount", { required: true })} />
            <input placeholder="단위" {...register("unit", { required: true })} />
          </div>
          <div>
            <button
              type="button"
              className="bg-slate-100 p-3 flex justify-center items-center"
              onClick={handleAddIngredients}
            >
              재료추가하기
            </button>
          </div>
        </div>

        {/* 단게별 레시피 */}
        <div className="flex flex-col bg-yellow-50 p-5">
          <div>
            <label className="font-bold">단계별 레시피 입력</label>
            <span>레시피를 보고 요리하는 사용자들을 위해 단계별 레시피를 입력해주세요!</span>
          </div>
          <div>
            <div>
              {recipeDoingImgView ? (
                <Image src={recipeDoingImgView} alt="이미지" width={200} height={200} objectFit="cover" />
              ) : (
                <p>선택된 이미지가 없습니다.</p>
              )}
              <input type="file" id="recipeImgDoing" name="recipeImgDoing" onChange={handleFileSelect} />
            </div>
            <textarea placeholder="상세하게 적을 수록 도움이 돼요!" {...register("recipeManual", { required: true })} />
          </div>
        </div>
        <input type="submit" />
      </form>
    </div>
  );
};

export default InputField;
