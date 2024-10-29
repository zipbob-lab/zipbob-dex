"use client";

import { createClient } from "@/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

enum RecipeMethodEnum {
  boil = "끓이기",
  roast = "굽기",
  frying = "튀기기",
  steaming = "찌기",
  stirfry = "볶기",
  other = "기타"
}

enum RecipeTypeEnum {
  bob = "밥",
  soup = "국&찌개",
  banchan = "반찬",
  desert = "후식",
  onefood = "일품",
  other = "기타"
}

interface IFormInput {
  recipeMethod: RecipeMethodEnum;
  recipeType: RecipeTypeEnum;
  recipeTitle: string;
  recipeDescription: string;
  recipeDoingImgs: (File | undefined)[];
  recipeDoingTexts: string[];
  ingredients: RecipeForm[];
  recipeManual: string;
}

export interface RecipeForm {
  ingredient: string;
  amount: string;
  unit: string;
}

const InputField = () => {
  // 상태관리
  const [recipeDoingImgFileArray, setRecipeDoingImgFileArray] = useState<File[]>([]);
  const [recipeDoingImgViewArray, setRecipeDoingImgViewArray] = useState<string[]>([]);
  const [recipeDoneImgFile, setRecipeDoneImgFile] = useState<File | undefined>(undefined);
  const [recipeDoneImgView, setRecipeDoneImgView] = useState<string>("");

  // ref 관리
  // const recipeDoneImgRef = useRef<HTMLInputElement | null>(null);
  // const recipeDoingImgRefs = useRef<HTMLInputElement[]>([]);

  // route
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit
    // watch
    // formState: { errors }
  } = useForm<IFormInput>({
    defaultValues: {
      ingredients: [{ ingredient: "", amount: "", unit: "" }],
      recipeDoingImgs: [undefined],
      recipeDoingTexts: [""]
    }
  });

  // 필드 어레이 관리
  // 재료 필드 배열 관리
  const { fields, append } = useFieldArray({
    control,
    name: "ingredients"
  });

  // 매뉴얼 이미지 배열 관리
  const { fields: recipeDoingsImgFields, append: appendRecipeDoingImg } = useFieldArray({
    control,
    name: "recipeDoingImgs"
  });

  // 매뉴얼 텍스트 배열 관리
  const { fields: recipeDoingsTextFields, append: appendRecipeDoingText } = useFieldArray({
    control,
    name: "recipeDoingTexts"
  });

  const handleAddIngredientsForm = () => {
    append({ ingredient: "", amount: "", unit: "" }, { shouldFocus: false });
  };

  const handleAddRecipeDoingForm = () => {
    appendRecipeDoingImg(undefined);
    appendRecipeDoingText("");
    setRecipeDoingImgFileArray((prev) => [...prev, undefined]);
    setRecipeDoingImgViewArray((prev) => [...prev, ""]);
  };

  useEffect(() => {
    if (recipeDoingsImgFields.length === 0) {
      appendRecipeDoingImg(undefined);
    }
    if (recipeDoingsTextFields.length === 0) {
      appendRecipeDoingText("");
    }
  }, []);

  // 이미지 선택
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // 업로드한 이미지 파일을 배열에 저장스
    const selectedImgFile = event.target.files?.[0];
    if (!selectedImgFile) return;

    setRecipeDoingImgFileArray((prev) => {
      const updateImgFiles = [...prev];
      updateImgFiles[index] = selectedImgFile || null;
      return updateImgFiles;
    });
    const imgViewUrl = URL.createObjectURL(selectedImgFile);
    // 이미지 미리보기를 배열에 저장스
    setRecipeDoingImgViewArray((prev) => {
      const updatedImgViews = [...prev];
      updatedImgViews[index] = imgViewUrl;
      return updatedImgViews;
    });
  };

  const handleImgDoneFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImgFile = event.target.files?.[0];
    if (selectedImgFile) {
      setRecipeDoneImgFile(selectedImgFile);
      setRecipeDoneImgView(URL.createObjectURL(selectedImgFile));
    }
  };

  const handleModalClose = () => {
    alert("모달 닫기");
  };

  // useEffect(() => {
  //   if (recipeDoingsImgFields.length === 0) {
  //     appendRecipeDoingImg(undefined);
  //   }
  //   if (recipeDoingsTextFields.length === 0) {
  //     appendRecipeDoingText("");
  //   }
  // }, []);

  // 폼 제출
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const supabase = createClient();

    try {
      // 로그인 세션
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error(sessionError.message);
        return sessionError;
      }
      const loginSessionId = session?.user?.id;

      // 이미지파일 유니크 파일명 만들어주는 함수
      const makeUniqueFileName = (file: File) => {
        const lastDot = file.name.lastIndexOf(".");
        const fileExtension = file.name.substring(lastDot + 1);
        const newFileName = Math.random().toString(36).slice(2, 13);
        const uniqueImgName = new Date().getTime();
        const imgFileName = `${uniqueImgName}_${newFileName}.${fileExtension}`;
        return imgFileName;
      };

      // 매뉴얼 이미지 업로드
      const recipeDoingImgUrls: string[] = [];
      for (let i = 0; i < recipeDoingImgFileArray.length; i++) {
        const recipeDoingImgFile = recipeDoingImgFileArray[i];
        if (recipeDoingImgFile) {
          const imgDoingName = makeUniqueFileName(recipeDoingImgFile);
          const { error: imgError } = await supabase.storage
            .from("zipbob_storage")
            .upload(`recipeDoingImgFolder/${imgDoingName}`, recipeDoingImgFile);
          if (imgError) {
            alert("매뉴얼 이미지 업로드 실패");
            console.error(imgError.message);
            return;
          } else {
            const recipeDoingImgUrl = `https://gnoefovruutfyrunuxkk.supabase.co/storage/v1/object/public/zipbob_storage/recipeDoingImgFolder/${imgDoingName}`;
            recipeDoingImgUrls.push(recipeDoingImgUrl); // push도 괜찮은가? 그게 아니면 일부 let을 사용해야하는데 ㄱㅊ은가?어차피 for문에서도 썼고..?
          }
        }
      }

      // 완료 이미지 업로드
      let recipeDoneImgUrl = "";
      if (recipeDoneImgFile) {
        const imgDoneName = makeUniqueFileName(recipeDoneImgFile);
        const { error: doneImgError } = await supabase.storage
          .from("zipbob_storage")
          .upload(`recipeDoneImgFolder/${imgDoneName}`, recipeDoneImgFile);
        if (doneImgError) {
          alert("완성 이미지 업로드 실패");
          console.error(doneImgError.message);
          return;
        } else {
          recipeDoneImgUrl = `https://gnoefovruutfyrunuxkk.supabase.co/storage/v1/object/public/zipbob_storage/recipeDoneImgFolder/${imgDoneName}`;
        }
      }

      // 난이도 설정
      let recipeLevel = "";
      if (data.ingredients.length > 0 && data.ingredients.length <= 3) {
        recipeLevel = "하";
      } else if (data.ingredients.length >= 4 && data.ingredients.length <= 6) {
        recipeLevel = "중";
      } else if (data.ingredients.length >= 7) {
        recipeLevel = "상";
      }

      // supabase에 데이터 INSERT
      const { error } = await supabase.from("TEST2_TABLE").insert({
        user_id: loginSessionId,
        post_id: uuidv4(),
        recipe_title: data.recipeTitle,
        recipe_type: RecipeTypeEnum[data.recipeType as unknown as keyof typeof RecipeTypeEnum],
        recipe_method: RecipeMethodEnum[data.recipeMethod as unknown as keyof typeof RecipeMethodEnum],
        recipe_ingredients: data.ingredients,
        recipe_img_doing: recipeDoingImgUrls,
        recipe_img_done: recipeDoneImgUrl,
        recipe_manual: data.recipeDoingTexts || [],
        recipe_description: data.recipeDescription,
        recipe_level: recipeLevel
      });

      if (error) {
        console.error("나만의 레시피 INSERT 에러 : ", error.message);
        return error;
      }

      // 유저 테이블 경험치 가져오기
      const { data: userData, error: userError } = await supabase
        .from("USER_TABLE")
        .select("user_exp")
        .eq("user_id", loginSessionId)
        .single();

      if (userError) {
        console.error("유저 테이블 SELECT 에러 : ", userError.message);
      } else {
        const userExp = userData.user_exp || 0;
        const updatedExp = userExp + 10;

        // 유저 테이블 경험치 추가
        const { error: updateUserError } = await supabase
          .from("USER_TABLE")
          .update({ user_exp: updatedExp })
          .eq("user_id", loginSessionId);

        if (updateUserError) {
          console.error("경험치 UPDATE 에러 : ", updateUserError.message);
        }
      }
      router.push("/RecipeAll");
      alert("레시피 작성이 완료되었습니다!");
    } catch (error) {
      console.error("레시피 작성 오류", error);
      alert("레시피 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col">
          <h1 className="text-2xl">나만의 레시피 등록하기</h1>
          <span>다른 사람들에게 소개하고 싶은 나만의 레시피를 등록해요!</span>
          <span>특별하지 않아도 괜찮아요, 상세하게 적을 수록 다른 사람들이 쉽게 만들 수 있어요.</span>
        </div>

        {/* 요리정보 */}
        <div className=" bg-slate-200 p-5 flex justify-between">
          <div>
            <div className="flex mb-5 gap-10">
              <label className="font-bold">카테고리</label>
              <select {...register("recipeMethod", { required: true })}>
                <option value="boil">끓이기</option>
                <option value="roast">굽기</option>
                <option value="frying">튀기기</option>
                <option value="steaming">찌기</option>
                <option value="stirfry">볶기</option>
                <option value="other">기타</option>
              </select>
              <select {...register("recipeType", { required: true })}>
                <option value="bob">밥</option>
                <option value="soup">국&찌개</option>
                <option value="banchan">반찬</option>
                <option value="onefood">일품</option>
                <option value="desert">후식</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div className="flex mb-5 gap-10">
              <label className="font-bold">레시피 제목</label>
              <input
                placeholder="예)10분이면 완성하는 바질 로제 파스타"
                {...register("recipeTitle", { required: true })}
              />
            </div>
            <div className="flex mb-5 gap-10">
              <label className="font-bold">요리 소개</label>
              <textarea
                placeholder="레시피의 탄생배경, 특징을 적어주세요."
                {...register("recipeDescription", { required: true })}
              />
            </div>
          </div>
          {/* 레시피 완성 이미지 */}
          <div className="w-48 h-48 rounded-lg bg-gray-500 relative overflow-hidden">
            {recipeDoneImgView ? (
              <Image src={recipeDoneImgView} alt="완성 이미지" fill={true} objectFit="cover" />
            ) : (
              <p>선택된 이미지가 없습니다.</p>
            )}
            <input type="file" onChange={handleImgDoneFileSelect} />
          </div>
        </div>

        {/* 재료 정보 */}
        <div className="flex flex-col bg-pink-200 p-5 gap-1">
          <label className="font-bold">재료 정보</label>
          <span>정보를 정확하게 입력하면 재료를 남기지 않을 수 있어요!</span>

          <div className="flex gap-5"></div>

          {fields.map((field, i) => (
            <div className="flex gap-5" key={field.id}>
              <input
                placeholder="양상추, 표고 버섯 등의 재료 이름"
                {...register(`ingredients.${i}.ingredient`, { required: true })}
              />
              <input placeholder="수량" {...register(`ingredients.${i}.amount`, { required: true })} />
              <input placeholder="단위" {...register(`ingredients.${i}.unit`, { required: true })} />
            </div>
          ))}

          <div>
            <button
              type="button"
              className="bg-slate-100 p-3 flex justify-center items-center"
              onClick={handleAddIngredientsForm}
            >
              재료 추가하기
            </button>
          </div>
        </div>

        {/* 단계별 레시피 */}
        <div className="flex flex-col bg-yellow-50 p-5 gap-10">
          <div className="flex flex-col mb-5">
            <label className="font-bold">단계별 레시피 입력</label>
            <span>레시피를 보고 요리하는 사용자들을 위해 단계별 레시피를 입력해주세요!</span>
          </div>

          {/* 단계별 레시피 이미지 */}
          {recipeDoingsImgFields.map((_, i) => (
            <div className="flex bg-green-200" key={i}>
              <div className="w-48 h-48 rounded-lg bg-gray-500 relative overflow-hidden">
                {recipeDoingImgViewArray[i] ? (
                  <Image src={recipeDoingImgViewArray[i]} alt="매뉴얼 이미지" fill={true} objectFit="cover" />
                ) : (
                  <p>선택된 이미지가 없습니다.</p>
                )}
                <input
                  type="file"
                  id={`recipeImgDoing${i}`}
                  {...register(`recipeDoingImgs.${i}`, {
                    onChange: (e) => handleFileSelect(e, i)
                  })}
                />
              </div>

              <textarea
                placeholder="자세하게 적을수록 더욱 도움이 돼요!"
                {...register(`recipeDoingTexts.${i}`, { required: true })}
              />
            </div>
          ))}

          <div>
            <button
              type="button"
              className="bg-slate-100 p-3 flex justify-center items-center"
              onClick={handleAddRecipeDoingForm}
            >
              레시피 추가하기
            </button>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="button" onClick={handleModalClose}>
          닫기
        </button>
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default InputField;