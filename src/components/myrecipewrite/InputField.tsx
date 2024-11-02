"use client";

import { createClient } from "@/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import ImageEditModal from "./ImageEditModal";
import RecipeInfoFields from "./RecipeInfoFields";
import IngredientsFields from "./IngredientsFields";
import { RecipeMethodEnum } from "@/types/RecipeMethodEnum";
import { RecipeTypeEnum } from "@/types/RecipeTypeEnum";

interface IFormInput {
  recipeMethod: RecipeMethodEnum;
  recipeType: RecipeTypeEnum;
  recipeTitle: string;
  recipeDescription: string;
  recipeDoneImg?: File | undefined;
  recipeDoingImgs?: { file: File | undefined }[];
  recipeDoingTexts?: { text: string }[];
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
  const [recipeDoingImgFileArray, setRecipeDoingImgFileArray] = useState<{ file: File | undefined }[]>([]);
  const [recipeDoingImgViewArray, setRecipeDoingImgViewArray] = useState<string[]>([]);
  const [recipeDoneImgFile, setRecipeDoneImgFile] = useState<File | undefined>(undefined);
  const [recipeDoneImgView, setRecipeDoneImgView] = useState<string>("");

  // 모달 관리
  const [imgModalIndex, setImgModalIndex] = useState<number | null>(null);
  const doneImgRef = useRef<HTMLInputElement | null>(null);
  const doingImgRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const methods = useForm<IFormInput>({
    defaultValues: {
      recipeDoneImg: undefined,
      recipeDoingImgs: [{ file: undefined }],
      recipeDoingTexts: [{ text: "" }],
      ingredients: [{ ingredient: "", amount: "", unit: "" }]
    }
  });

  const { ref, onChange, ...rest } = methods.register("recipeDoneImg");

  // 매뉴얼 이미지 배열 관리
  const { fields: recipeDoingsImgFields, append: appendRecipeDoingImg } = useFieldArray({
    control: methods.control,
    name: "recipeDoingImgs"
  });

  // 매뉴얼 텍스트 배열 관리
  const { append: appendRecipeDoingText } = useFieldArray({
    control: methods.control,
    name: "recipeDoingTexts"
  });

  const handleAddRecipeDoingForm = () => {
    appendRecipeDoingImg({ file: undefined });
    appendRecipeDoingText({ text: "" });
    setRecipeDoingImgFileArray((prev) => [...prev, { file: undefined }]);
    setRecipeDoingImgViewArray((prev) => [...prev, ""]);
  };

  //
  const handleDoingImgFileSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const selectedImgFile = event.target.files?.[0];
    if (!selectedImgFile) return;

    setRecipeDoingImgFileArray((prev) => {
      const updateImgFiles = [...prev];
      updateImgFiles[index] = { file: selectedImgFile || undefined };
      return updateImgFiles;
    });
    const imgViewUrl = URL.createObjectURL(selectedImgFile);
    setRecipeDoingImgViewArray((prev) => {
      const updatedImgViews = [...prev];
      updatedImgViews[index] = imgViewUrl;
      return updatedImgViews;
    });

    setImgModalIndex(null); // 파일 업로드 후 모달 닫기
  };

  const handleDoneImgFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImgFile = event.target.files?.[0];
    if (selectedImgFile) {
      setRecipeDoneImgFile(selectedImgFile);
      setRecipeDoneImgView(URL.createObjectURL(selectedImgFile));
    }
  };

  const handleModalClose = () => {
    router.back();
  };

  const toggleImgModal = (index: number) => {
    if (recipeDoingImgViewArray[index]) {
      setImgModalIndex(imgModalIndex === index ? null : index);
    }
  };

  const handleModifyImage = (index: number) => {
    if (index === -1) {
      methods.setValue("recipeDoneImg", undefined);
      if (doneImgRef.current) {
        doneImgRef.current.click();
      }
    } else {
      methods.setValue(`recipeDoingImgs.${index}`, { file: undefined });
      if (doingImgRefs.current[index]) {
        doingImgRefs.current[index].click();
      }
    }
    setImgModalIndex(null);
  };

  const handleDeleteImage = (index: number) => {
    setRecipeDoingImgFileArray((prev) => prev.map((file, i) => (i === index ? { file: undefined } : file)));
    setRecipeDoingImgViewArray((prev) => prev.map((view, i) => (i === index ? "" : view)));
    setImgModalIndex(null);
  };

  // 폼 제출
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const supabase = createClient();

    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error(sessionError.message);
        return sessionError;
      }
      const loginSessionId = session?.user?.id;

      const makeUniqueFileName = (file: File) => {
        const fileExtension = file.name.split(".").pop();
        return `${Date.now()}_${Math.random().toString(36).slice(2, 13)}.${fileExtension}`;
      };

      const recipeDoingImgUrls: string[] = [];
      for (let i = 0; i < recipeDoingImgFileArray.length; i++) {
        const recipeDoingImgFile = recipeDoingImgFileArray[i].file;
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
            const recipeDoingImgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/recipeDoingImgFolder/${imgDoingName}`;
            recipeDoingImgUrls.push(recipeDoingImgUrl);
          }
        }
      }

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
          recipeDoneImgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/recipeDoneImgFolder/${imgDoneName}`;
        }
      }

      let recipeLevel = "";
      if (data.ingredients.length > 0 && data.ingredients.length <= 3) {
        recipeLevel = "하";
      } else if (data.ingredients.length >= 4 && data.ingredients.length <= 6) {
        recipeLevel = "중";
      } else if (data.ingredients.length >= 7) {
        recipeLevel = "상";
      }

      const { error } = await supabase.from("TEST2_TABLE").insert({
        user_id: loginSessionId,
        post_id: uuidv4(),
        recipe_title: data.recipeTitle,
        recipe_type: RecipeTypeEnum[data.recipeType as unknown as keyof typeof RecipeTypeEnum],
        recipe_method: RecipeMethodEnum[data.recipeMethod as unknown as keyof typeof RecipeMethodEnum],
        recipe_ingredients: data.ingredients,
        recipe_img_doing: recipeDoingImgUrls,
        recipe_img_done: recipeDoneImgUrl,
        recipe_manual: data.recipeDoingTexts?.map((item) => item.text) || [],
        recipe_description: data.recipeDescription,
        recipe_level: recipeLevel
      });

      if (error) {
        console.error("나만의 레시피 INSERT 에러 : ", error.message);
        return error;
      }

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

        const { error: updateUserError } = await supabase
          .from("USER_TABLE")
          .update({ user_exp: updatedExp })
          .eq("user_id", loginSessionId);

        if (updateUserError) {
          console.error("경험치 UPDATE 에러 : ", updateUserError.message);
        }
      }
      alert("레시피 작성이 완료되었습니다!");
      router.back();
    } catch (error) {
      console.error("레시피 작성 오류", error);
      alert("레시피 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-5 flex flex-col gap-5">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mb-5 flex flex-col">
            <h1 className="text-2xl">나만의 레시피 등록하기</h1>
            <span>다른 사람들에게 소개하고 싶은 나만의 레시피를 등록해요!</span>
            <span>특별하지 않아도 괜찮아요, 상세하게 적을 수록 다른 사람들이 쉽게 만들 수 있어요.</span>
          </div>

          {/* 요리정보 */}
          <div className=" bg-slate-200 p-5 flex justify-between">
            <RecipeInfoFields />
            {/* 레시피 완성 이미지 */}
            <div
              className="w-48 h-48 rounded-lg bg-gray-500 relative overflow-hidden flex items-center justify-center"
              onClick={() => {
                if (recipeDoneImgView) {
                  setImgModalIndex(-1);
                }
              }}
            >
              {recipeDoneImgView ? (
                <Image src={recipeDoneImgView} alt="완성 이미지" fill={true} objectFit="cover" />
              ) : (
                <p>이미지 파일</p>
              )}
              <input
                type="file"
                {...rest}
                ref={(imgEl) => {
                  ref(imgEl);
                  doneImgRef.current = imgEl;
                }}
                onChange={(e) => {
                  onChange(e);
                  handleDoneImgFileSelect(e);
                }}
                className={`absolute inset-0 opacity-0 cursor-pointer ${recipeDoneImgView ? "pointer-events-none" : ""}`}
              />
            </div>
          </div>

          {/* 재료 정보 */}
          <IngredientsFields />

          {/* 단계별 레시피 */}
          <div className="flex flex-col bg-yellow-50 p-5 gap-10">
            <div className="flex flex-col mb-5">
              <label className="font-bold">단계별 레시피 입력</label>
              <span>레시피를 보고 요리하는 사용자들을 위해 단계별 레시피를 입력해주세요!</span>
            </div>

            {recipeDoingsImgFields.map((_, i) => (
              <div className="flex bg-green-200" key={i}>
                <div
                  className="w-48 h-48 rounded-lg bg-gray-500 relative overflow-hidden flex items-center justify-center"
                  onClick={() => toggleImgModal(i)}
                >
                  {recipeDoingImgViewArray[i] ? (
                    <Image src={recipeDoingImgViewArray[i]} alt="매뉴얼 이미지" fill={true} objectFit="cover" />
                  ) : (
                    <p>선택된 이미지가 없습니다.</p>
                  )}
                  <input
                    type="file"
                    id={`recipeImgDoing${i}`}
                    {...methods.register(`recipeDoingImgs.${i}`, {
                      onChange: (e) => handleDoingImgFileSelect(e, i)
                    })}
                    ref={(doingEl) => {
                      methods.register(`recipeDoingImgs.${i}`).ref(doingEl);
                      doingImgRefs.current[i] = doingEl;
                    }}
                    className={`absolute inset-0 opacity-0 ${recipeDoingImgViewArray[i] ? "pointer-events-none" : ""}`}
                  />
                </div>

                <textarea
                  className="resize-none"
                  placeholder="자세하게 적을수록 더욱 도움이 돼요!"
                  {...methods.register(`recipeDoingTexts.${i}.text`, { required: true })}
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

          {/* 단계별 이미지 모달 */}
          {imgModalIndex !== null && recipeDoingImgViewArray[imgModalIndex] && (
            <ImageEditModal
              handleModify={() => handleModifyImage(imgModalIndex)}
              handleDelete={() => handleDeleteImage(imgModalIndex)}
              handleClose={() => setImgModalIndex(null)}
            />
          )}

          {/* 완성 이미지 모달 */}
          {imgModalIndex === -1 && recipeDoneImgView && (
            <ImageEditModal
              handleModify={() => handleModifyImage(-1)}
              handleDelete={() => {
                setRecipeDoneImgFile(undefined);
                setRecipeDoneImgView("");
                setImgModalIndex(null);
              }}
              handleClose={() => setImgModalIndex(null)}
            />
          )}

          {/* 제출 버튼 */}
          <button type="button" onClick={handleModalClose}>
            닫기
          </button>
          <button type="submit">등록하기</button>
        </form>
      </div>
    </FormProvider>
  );
};

export default InputField;
