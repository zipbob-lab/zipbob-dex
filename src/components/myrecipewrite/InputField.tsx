"use client";

import { createClient } from "@/supabase/client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { RecipeMethodEnum } from "@/types/RecipeMethodEnum";
import { RecipeTypeEnum } from "@/types/RecipeTypeEnum";
import { supabase } from "@/supabase/supabase";
import { Recipe } from "@/types/Recipe";
import RecipeInfoFields from "./RecipeInfoFields";
import IngredientsFields from "./IngredientsFields";
import ImageEditModal from "./ImageEditModal";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const isModifyMode = !!postId;
  // const queryClient = useQueryClient();

  // 상태관리
  const [recipeDoingImgFileArray, setRecipeDoingImgFileArray] = useState<{ file: File | undefined }[]>([]);
  const [recipeDoingImgViewArray, setRecipeDoingImgViewArray] = useState<string[]>([]);
  const [recipeDoneImgFile, setRecipeDoneImgFile] = useState<File | undefined>(undefined);
  const [recipeDoneImgView, setRecipeDoneImgView] = useState<string>("");
  const [fetchData, setFetchData] = useState<Recipe | null>(null);

  // 모달 관리
  const [imgModalIndex, setImgModalIndex] = useState<number | null>(null);
  const doneImgRef = useRef<HTMLInputElement | null>(null);
  const doingImgRefs = useRef<(HTMLInputElement | null)[]>([]);

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
  const {
    fields: recipeDoingsImgFields,
    append: appendRecipeDoingImg,
    replace: replaceRecipeDoingImgs
    // remove: removeRecipeDoingImgs
  } = useFieldArray({
    control: methods.control,
    name: "recipeDoingImgs"
  });

  // 매뉴얼 텍스트 배열 관리
  const { append: appendRecipeDoingText, replace: replaceRecipeDoingTexts } = useFieldArray({
    control: methods.control,
    name: "recipeDoingTexts"
  });

  const handleAddRecipeDoingForm = () => {
    appendRecipeDoingImg({ file: undefined });
    appendRecipeDoingText({ text: "" });

    setRecipeDoingImgFileArray((prev) => [...prev, { file: undefined }]);
    setRecipeDoingImgViewArray((prev) => [...prev, ""]);
  };

  // 수정 모드일 경우 데이터 가져오기
  useEffect(() => {
    if (isModifyMode && postId) {
      fetchOriginRecipeData(postId);
    }
  }, [isModifyMode, postId]);

  const fetchOriginRecipeData = async (postId: string) => {
    const { data, error } = await supabase.from("TEST2_TABLE").select("*").eq("post_id", postId).single();

    if (error) {
      console.error("레시피 불러오기 에러", error.message);
    } else {
      setFetchData(data as Recipe);
      // 기존 이미지 뷰에 넣어주기(초기화)
      setRecipeDoneImgView(data?.recipe_img_done ?? "");
      const existingImgViews = data?.recipe_img_doing ?? [];
      setRecipeDoingImgViewArray(existingImgViews);
      setRecipeDoingImgFileArray(existingImgViews.map(() => ({ file: undefined })));

      methods.reset({
        recipeTitle: data.recipe_title,
        recipeDescription: data.recipe_description,
        recipeType: data.recipe_type,
        recipeMethod: data.recipe_method,
        ingredients: data.recipe_ingredients,
        recipeManual: data.recipe_manual
      });
      // 기존 동적 폼 길이 맞추기 (배열 초기화)
      replaceRecipeDoingImgs(existingImgViews.map(() => ({ file: undefined })));
      replaceRecipeDoingTexts(data.recipe_manual.map((text: string) => ({ text })));
    }
  };

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
    // 파일 업로드 후 모달 닫기
    setImgModalIndex(null);
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
    if (index === -1) {
      setRecipeDoneImgFile(undefined);
      setRecipeDoneImgView("");
    } else {
      // setRecipeDoingImgFileArray((prev) => prev.map((file, i) => (i === index ? { file: undefined } : file)));
      // setRecipeDoingImgViewArray((prev) => prev.map((view, i) => (i === index ? "" : view)));
      const updatedFileArray = [...recipeDoingImgFileArray];
      updatedFileArray[index] = { file: undefined };
      setRecipeDoingImgFileArray(updatedFileArray);

      const updatedViewArray = [...recipeDoingImgViewArray];
      updatedViewArray[index] =
        "https://gnoefovruutfyrunuxkk.supabase.co/storage/v1/object/public/zipbob_storage/recipeDoneImgFolder/images%20(4).jfif";
      // 여기다가 기본 이미지 넣어야됨
      setRecipeDoingImgViewArray(updatedViewArray);
    }
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
      for (let i = 0; i < recipeDoingImgViewArray.length; i++) {
        if (isModifyMode) {
          // 수정 모드일 때

          const recipeDoingImgFile = recipeDoingImgFileArray[i]?.file;
          if (recipeDoingImgFile instanceof File) {
            // 새로 업로드된 파일이 있는 경우
            const imgDoingName = makeUniqueFileName(recipeDoingImgFile);
            const { error: imgError } = await supabase.storage
              .from("zipbob_storage")
              .upload(`recipeDoingImgFolder/${imgDoingName}`, recipeDoingImgFile);

            if (imgError) {
              alert("매뉴얼 이미지 업로드 실패");
              console.error(imgError.message);
              return;
            }

            const recipeDoingImgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/recipeDoingImgFolder/${imgDoingName}`;
            recipeDoingImgUrls.push(recipeDoingImgUrl);
          } else if (recipeDoingImgViewArray[i]) {
            // 기존 이미지 URL이 있는 경우
            recipeDoingImgUrls.push(recipeDoingImgViewArray[i] || "");
          }
        } else {
          // 작성 모드일 때
          const recipeDoingImgFile = recipeDoingImgFileArray[i]?.file;
          if (recipeDoingImgFile instanceof File) {
            const imgDoingName = makeUniqueFileName(recipeDoingImgFile);
            const { error: imgError } = await supabase.storage
              .from("zipbob_storage")
              .upload(`recipeDoingImgFolder/${imgDoingName}`, recipeDoingImgFile);

            if (imgError) {
              alert("매뉴얼 이미지 업로드 실패");
              console.error(imgError.message);
              return;
            }

            const recipeDoingImgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/recipeDoingImgFolder/${imgDoingName}`;
            recipeDoingImgUrls.push(recipeDoingImgUrl);
          }
        }
      }

      let recipeDoneImgUrl = fetchData?.recipe_img_done;
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

      const recipeData = {
        user_id: loginSessionId,
        recipe_title: data.recipeTitle,
        recipe_type: RecipeTypeEnum[data.recipeType as unknown as keyof typeof RecipeTypeEnum],
        recipe_method: RecipeMethodEnum[data.recipeMethod as unknown as keyof typeof RecipeMethodEnum],
        recipe_ingredients: data.ingredients,
        recipe_img_doing: recipeDoingImgUrls,
        recipe_img_done: recipeDoneImgUrl,
        recipe_manual: data.recipeDoingTexts?.map((item) => item.text) || [],
        recipe_description: data.recipeDescription,
        recipe_level: recipeLevel
      };

      if (isModifyMode) {
        // 수정 모드
        const { error: updateError } = await supabase.from("TEST2_TABLE").update(recipeData).eq("post_id", postId);
        if (updateError) {
          console.error("업데이트 오류", updateError.message);
          return;
        }
        console.log("업데이트 완료!");
      } else {
        // 작성 모드
        const { error } = await supabase.from("TEST2_TABLE").insert({ ...recipeData, post_id: uuidv4() });

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
      }

      router.back();
    } catch (error) {
      console.error("레시피 작성 오류", error);
      alert("레시피 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-5 p-5">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mb-5 flex flex-col">
            <h1 className="text-2xl">나만의 레시피 등록하기</h1>
            <span>다른 사람들에게 소개하고 싶은 나만의 레시피를 등록해요!</span>
            <span>특별하지 않아도 괜찮아요, 상세하게 적을 수록 다른 사람들이 쉽게 만들 수 있어요.</span>
          </div>

          {/* 요리정보 */}
          <div className="flex justify-between bg-slate-200 p-5">
            <RecipeInfoFields />
            {/* 레시피 완성 이미지 */}
            <div
              className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg bg-gray-500"
              onClick={() => {
                if (recipeDoneImgView) {
                  setImgModalIndex(-1);
                }
              }}
            >
              {recipeDoneImgView ? (
                <Image src={recipeDoneImgView} alt="완성 이미지" fill={true} style={{ objectFit: "cover" }} />
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
                className={`absolute inset-0 cursor-pointer opacity-0 ${recipeDoneImgView ? "pointer-events-none" : ""}`}
              />
            </div>
          </div>

          {/* 재료 정보 */}
          <IngredientsFields />

          {/* 단계별 레시피 */}
          <div className="flex flex-col gap-10 bg-yellow-50 p-5">
            <div className="mb-5 flex flex-col">
              <label className="font-bold">단계별 레시피 입력</label>
              <span>레시피를 보고 요리하는 사용자들을 위해 단계별 레시피를 입력해주세요!</span>
            </div>

            {recipeDoingsImgFields.map((_, i) => (
              <div className="flex bg-green-200" key={i}>
                <div
                  className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg bg-gray-500"
                  onClick={() => toggleImgModal(i)}
                >
                  {recipeDoingImgViewArray[i] ? (
                    <Image
                      src={recipeDoingImgViewArray[i]}
                      alt="매뉴얼 이미지"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
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
                className="flex items-center justify-center bg-slate-100 p-3"
                onClick={handleAddRecipeDoingForm}
              >
                레시피 추가하기
              </button>
            </div>
          </div>

          {/* 단계별 이미지 편집 모달 */}
          {imgModalIndex !== null && recipeDoingImgViewArray[imgModalIndex] && (
            <ImageEditModal
              handleModify={() => handleModifyImage(imgModalIndex)}
              handleDelete={() => handleDeleteImage(imgModalIndex)}
              handleClose={() => setImgModalIndex(null)}
            />
          )}

          {/* 완성 이미지 편집 모달 */}
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
