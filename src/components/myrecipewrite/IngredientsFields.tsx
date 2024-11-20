"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import RecipeAddButton from "@images/myrecipe/recipeAddButton.svg";
import IconX from "@images/myrecipe/iconX.svg";
import Image from "next/image";

const IngredientsFields = () => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients"
  });

  const handleAddIngredientsForm = () => {
    append({ ingredient: "", amount: "", unit: "" }, { shouldFocus: false });
  };

  return (
    <div
      className="flex w-full flex-col gap-y-10 rounded-3xl bg-white px-[1.5rem] py-[2rem]"
      style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.10)" }}
    >
      <div className="flex flex-col gap-y-2">
        <label className="text-title-18 text-Gray-900 md:text-heading-24">재료 정보</label>
        <span className="text-body-14 text-Gray-500 md:text-body-16">
          정보를 정확하게 입력하면 재료를 남기지 않을 수 있어요!
        </span>
      </div>

      {fields.map((field, i) => (
        <div className="flex w-full lg:gap-x-[1rem] md:gap-x-[0.75rem] gap-x-[0.5rem]" key={field.id}>
          <input
            className="input-focus w-[60%] rounded-[1rem] bg-Gray-50 px-4 py-3 text-r-body-14 md:text-body-16"
            placeholder="재료 이름"
            {...register(`ingredients.${i}.ingredient`, { required: true })}
          />
          <input
            placeholder="수량"
            {...register(`ingredients.${i}.amount`, { required: true })}
            className="input-focus w-[20%] rounded-[1rem] bg-Gray-50 px-4 py-3 text-r-body-14 md:text-body-16"
          />
          <input
            placeholder="단위"
            {...register(`ingredients.${i}.unit`, { required: true })}
            className="input-focus w-[20%] rounded-[1rem] bg-Gray-50 px-4 py-3 text-r-body-14 md:text-body-16"
          />
          <div className="x-[1.5rem] flex items-center justify-center">
            <button
              type="button"
              onClick={() => remove(i)}
              style={{ visibility: fields.length > 1 ? "visible" : "hidden" }}
            >
              <Image src={IconX} width={24} height={24} alt="삭제" />
            </button>
          </div>
        </div>
      ))}

      <div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-Primary-50 py-[0.5rem] md:py-[0.75rem]"
          onClick={handleAddIngredientsForm}
        >
          <Image
            src={RecipeAddButton}
            alt="재료 추가버튼"
            className="h-[1.25rem] w-[1.25rem] lg:h-[1.5rem] lg:w-[1.5rem]"
          />
          <span className="text-title-16 md:text-title-18 text-Gray-900">재료 추가하기</span>
        </button>
      </div>
    </div>
  );
};

export default IngredientsFields;
