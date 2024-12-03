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
import { Recipe } from "@/types/Search";
import RecipeInfoFields from "./RecipeInfoFields";
import IngredientsFields from "./IngredientsFields";
import ImageEditModal from "./ImageEditModal";
import ImageUploadIcon from "@images/myrecipe/imageUpload.svg";
import RecipeAddButton from "@images/myrecipe/recipeAddButton.svg";
import CloseWriteConfirm from "./CloseWriteConfirm";
import { IFormInput } from "@/types/RecipeWriteFormType";
import IconX from "@images/myrecipe/iconX.svg";
import { useQueryClient } from "@tanstack/react-query";
import RecipeSubmitButton from "./RecipeSubmitButton";

const InputField = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const isModifyMode = !!postId;
  const queryClient = useQueryClient();

  // 상태관리
  const [recipeDoingImgFileArray, setRecipeDoingImgFileArray] = useState<{ file: File | undefined }[]>([]);
  const [recipeDoingImgViewArray, setRecipeDoingImgViewArray] = useState<string[]>([""]);
  const [recipeDoneImgFile, setRecipeDoneImgFile] = useState<File | undefined>(undefined);
  const [recipeDoneImgView, setRecipeDoneImgView] = useState<string>("");
  const [fetchData, setFetchData] = useState<Recipe | null>(null);

  // 모달 관리
  const [imgModalIndex, setImgModalIndex] = useState<number | null>(null);
  const [closeWriteModal, setCloseWriteModal] = useState<boolean>(false);
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
    replace: replaceRecipeDoingImgs,
    remove: removeRecipeDoingImgs
  } = useFieldArray({
    control: methods.control,
    name: "recipeDoingImgs"
  });

  // 매뉴얼 텍스트 배열 관리
  const {
    append: appendRecipeDoingText,
    replace: replaceRecipeDoingTexts,
    remove: removeRecipeDoingTexts
  } = useFieldArray({
    control: methods.control,
    name: "recipeDoingTexts"
  });

  const handleAddRecipeDoingForm = () => {
    appendRecipeDoingImg({ file: undefined });
    appendRecipeDoingText({ text: "" });

    setRecipeDoingImgFileArray((prev) => [...prev, { file: undefined }]);
    setRecipeDoingImgViewArray((prev) => [...prev, ""]);
  };

  // 레시피 단계 삭제
  const handleRemoveRecipeDoingForm = (index: number) => {
    removeRecipeDoingImgs(index);
    removeRecipeDoingTexts(index);
    setRecipeDoingImgFileArray((prev) => prev.filter((_, i) => i !== index));
    setRecipeDoingImgViewArray((prev) => prev.filter((_, i) => i !== index));
  };

  // 수정 모드일 경우 데이터 가져오기
  useEffect(() => {
    if (isModifyMode && postId) {
      fetchOriginRecipeData(postId);
    }
  }, [isModifyMode, postId]);

  const getEnumKeyByEnumValue = <TEnumKey extends string, TEnumVal extends string | number>(
    myEnum: { [key in TEnumKey]: TEnumVal },
    enumValue: TEnumVal
  ): string => {
    const keys = (Object.keys(myEnum) as TEnumKey[]).filter((x) => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : "";
  };

  const fetchOriginRecipeData = async (postId: string) => {
    const { data, error } = await supabase.from("MY_RECIPE_TABLE").select("*").eq("post_id", postId).single();

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
        recipeType: getEnumKeyByEnumValue(RecipeTypeEnum, data.recipe_type) as RecipeTypeEnum,
        recipeMethod: getEnumKeyByEnumValue(RecipeMethodEnum, data.recipe_method) as RecipeMethodEnum,
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
      const updatedFileArray = [...recipeDoingImgFileArray];
      updatedFileArray[index] = ImageUploadIcon;
      setRecipeDoingImgFileArray(updatedFileArray);

      const updatedViewArray = [...recipeDoingImgViewArray];
      // 기본이미지
      updatedViewArray[index] = "/DEFAULT_IMAGE";
      setRecipeDoingImgViewArray(updatedViewArray);
    }

    setImgModalIndex(null);
  };

  // 폼 제출
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const supabase = createClient();
    const newPostId = isModifyMode ? postId : uuidv4();

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

      // 매뉴얼 이미지 업로드 & 수정
      const recipeDoingImgUrls: string[] = [];
      for (let i = 0; i < recipeDoingImgViewArray.length; i++) {
        const recipeDoingImgFile = recipeDoingImgFileArray[i]?.file;

        // 새로 업로드된 파일이 있는 경우
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
        } else if (isModifyMode && recipeDoingImgViewArray[i]) {
          // 수정 모드일 때 & 기존 이미지 URL이 있는 경우
          recipeDoingImgUrls.push(recipeDoingImgViewArray[i]);
        } else {
          recipeDoingImgUrls.push("");
          // 파일이 없는 경우 빈 문자열
        }
      }

      let recipeDoneImgUrl = fetchData?.recipe_img_done ?? "";
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
        const { error: updateError } = await supabase.from("MY_RECIPE_TABLE").update(recipeData).eq("post_id", postId);
        if (updateError) {
          console.error("업데이트 오류", updateError.message);
          return;
        }
        alert("수정 완료");
        queryClient.invalidateQueries({ queryKey: ["recipeWithUser", postId] });

        setImgModalIndex(null);
        router.push(`/myrecipedetail/${postId}`);
      } else {
        // 작성 모드
        const { error } = await supabase.from("MY_RECIPE_TABLE").insert({ ...recipeData, post_id: newPostId });

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
      }

      alert("레시피 작성이 완료되었습니다!");
      router.back();
      // 작성 게시글로 이동
      setTimeout(() => {
        router.push(`/myrecipedetail/${newPostId}`);
      }, 3);
    } catch (error) {
      console.error("레시피 작성 오류", error);
      alert("레시피 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* 전체 컨테이너 */}
        <div className="relative flex max-w-[20.94rem] flex-col gap-y-[1.5rem] px-[1.25rem] py-[2rem] ssm:max-w-[27.5rem] ssm:gap-y-[2rem] sm:max-w-[27.56rem] sm:px-[1.25rem] sm:py-[2rem] md:max-w-[55.44rem] md:px-[2rem] md:py-[3rem] lg:max-w-[67.5rem] lg:overflow-hidden">
          <div className="h-max-full flex flex-col gap-y-[2.5rem] overflow-y-auto lg:h-[50.69rem] [&::-webkit-scrollbar]:hidden">
            {/* 헤더 영역 */}
            <div className="flex max-w-[33rem] flex-col gap-y-4 px-[0.75rem] md:max-w-[51.44rem] lg:max-w-[63.5rem]">
              <h1 className="text-heading-20 text-Gray-900 md:text-heading-28">나만의 레시피 등록하기</h1>
              <div className="flex flex-col text-body-14 text-Gray-600 md:text-body-16">
                <span>다른 사람들에게 소개하고 싶은 나만의 레시피를 등록해요!</span>
                <span>특별하지 않아도 괜찮아요, 상세하게 적을 수록 다른 사람들이 쉽게 만들 수 있어요.</span>
              </div>
            </div>

            <div className="flex flex-col gap-y-[1.5rem]">
              {/* 상단 */}

              {/* 인풋창 */}
              <div className="flex flex-col gap-y-6">
                {/* 요리 정보 */}
                <div
                  className="flex w-full flex-col gap-y-10 rounded-3xl bg-white px-[1.5rem] py-[2rem]"
                  style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.10)" }}
                >
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-title-18 text-Gray-900 md:text-heading-24">레시피 정보 입력</h1>
                    <div className="flex flex-col text-body-14 text-Gray-600 md:text-body-16">
                      <span>나만의 레시피를 설명할 수 있는 정보를 입력해주세요! </span>
                      <span>특징이 잘 드러나면 다른 사용자들이 내 레시피를 쉽게 이해할 수 있어요.</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-x-[1rem] gap-y-[2rem] lg:flex-row lg:gap-y-[0rem]">
                    {/* 레시피 완성 이미지 ~lg */}
                    <div className="flex items-center justify-center justify-items-end lg:hidden">
                      <div
                        className="relative h-[11.5rem] w-[11.5rem] flex-shrink-0 overflow-hidden rounded-[1rem] md:h-[15rem] md:w-[15rem] md:rounded-[10%]"
                        onClick={() => {
                          if (recipeDoneImgView) {
                            setImgModalIndex(-1);
                          }
                        }}
                      >
                        {recipeDoneImgView ? (
                          <Image src={recipeDoneImgView} alt="완성 이미지" fill={true} style={{ objectFit: "cover" }} />
                        ) : (
                          <Image
                            src={ImageUploadIcon}
                            alt="기본 이미지"
                            fill
                            style={{ objectFit: "cover", objectPosition: "center" }}
                          />
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

                    <RecipeInfoFields />

                    {/* 레시피 완성 이미지 */}
                    <div className="flex hidden w-full justify-items-end lg:inline-block">
                      <div
                        className="relative h-[11.5rem] w-[11.5rem] flex-shrink-0 overflow-hidden rounded-[1rem] md:h-[15rem] md:w-[15rem] md:rounded-[10%]"
                        onClick={() => {
                          if (recipeDoneImgView) {
                            setImgModalIndex(-1);
                          }
                        }}
                      >
                        {recipeDoneImgView ? (
                          <Image src={recipeDoneImgView} alt="완성 이미지" fill={true} style={{ objectFit: "cover" }} />
                        ) : (
                          <Image
                            src={ImageUploadIcon}
                            alt="기본 이미지"
                            fill
                            style={{ objectFit: "cover", objectPosition: "center" }}
                          />
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
                  </div>
                </div>

                {/* 재료 정보 */}
                <IngredientsFields />

                {/* 단계별 레시피 */}
                <div
                  className="flex w-full flex-col gap-y-10 rounded-3xl bg-white px-[1.5rem] py-[2rem]"
                  style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.10)" }}
                >
                  <div className="flex w-full flex-col gap-y-2">
                    <label className="text-title-18 text-Gray-900 md:text-heading-24">단계별 레시피 입력</label>
                    <div className="text-body-14 text-Gray-500 md:text-body-16">
                      <span>차근차근 따라할 수 있도록 자세히 작성해요. </span>
                      <span>단계별 주의사항이나 팁도 함께 적으면 좋아요!</span>
                    </div>
                  </div>

                  {recipeDoingsImgFields.map((_, i) => (
                    <div className="flex w-full flex-col gap-y-[0.75rem] md:flex-row" key={i}>
                      {/* ~MD */}
                      <div className="block flex justify-between md:hidden">
                        <div>
                          <div className="flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-[2.5rem] bg-Secondary-50 text-title-18 text-Secondary-400">
                            {i + 1}
                          </div>
                        </div>
                        <div className="x-[1.5rem]">
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipeDoingForm(i)}
                            style={{ visibility: recipeDoingsImgFields.length > 1 ? "visible" : "hidden" }}
                          >
                            <Image src={IconX} className="x-[1.5rem] y-[1.5rem]" alt="삭제" />
                          </button>
                        </div>
                      </div>

                      <div className="flex w-full flex-row items-center gap-x-[0.75rem] lg:gap-x-[1rem]">
                        <div className="hidden md:block">
                          <div className="flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-[2.5rem] bg-Secondary-50 text-title-18 text-Secondary-400">
                            {i + 1}
                          </div>
                        </div>
                        <div
                          className="relative h-[5.5rem] w-[5.5rem] flex-shrink-0 overflow-hidden rounded-[0.5rem] sm:h-[7.5rem] sm:w-[7.5rem] sm:rounded-[0.75rem] md:h-[10rem] md:w-[10rem] md:rounded-[1rem]"
                          style={{ borderRadius: "13.3px" }}
                          onClick={() => toggleImgModal(i)}
                        >
                          <Image
                            src={
                              recipeDoingImgViewArray[i] && recipeDoingImgViewArray[i] !== "/DEFAULT_IMAGE"
                                ? recipeDoingImgViewArray[i]
                                : ImageUploadIcon
                            }
                            alt="매뉴얼 이미지"
                            fill
                            style={{ objectFit: "cover", objectPosition: "center" }}
                            className="rounded-lg"
                          />
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
                            className={`absolute inset-0 cursor-pointer opacity-0 ${recipeDoingImgViewArray[i] ? "pointer-events-none" : ""}`}
                          />
                        </div>
                        <textarea
                          className="input-focus h-[5.625rem] w-[44.125rem] resize-none rounded-[16px] bg-Gray-50 px-4 py-3 text-r-body-14 text-Gray-500 sm:h-[7.5rem] md:h-[10rem] md:text-body-16"
                          placeholder="자세하게 적을수록 더욱 도움이 돼요!"
                          {...methods.register(`recipeDoingTexts.${i}.text`, { required: true })}
                        />
                        {/* 레시피 삭제 */}
                        <div className="x-[1.5rem] hidden md:block">
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipeDoingForm(i)}
                            style={{ visibility: recipeDoingsImgFields.length > 1 ? "visible" : "hidden" }}
                          >
                            <Image src={IconX} className="x-[1.5rem] y-[1.5rem]" alt="삭제" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-Primary-50 py-3"
                      onClick={handleAddRecipeDoingForm}
                    >
                      <Image
                        src={RecipeAddButton}
                        alt="레시피 추가버튼"
                        className="h-[1.25rem] w-[1.25rem] lg:h-[1.5rem] lg:w-[1.5rem]"
                      />
                      <span className="text-title-16 text-Gray-900 md:text-title-18">단계 추가하기</span>
                    </button>
                  </div>
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
            </div>
          </div>
          <div className="lg:z-500 lg:sticky lg:bottom-0">
            {/* 제출 버튼 */}
            <RecipeSubmitButton closeModal={() => setCloseWriteModal(true)} />
            {/* 닫기 확인 모달 */}
            <CloseWriteConfirm closeWriteModal={closeWriteModal} setCloseWriteModal={setCloseWriteModal} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default InputField;
