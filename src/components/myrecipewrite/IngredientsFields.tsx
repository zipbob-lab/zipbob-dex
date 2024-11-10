"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import RecipeAddButton from "@images/myrecipe/recipeAddButton.svg";
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
      className="flex w-full flex-col gap-y-10 rounded-3xl bg-white px-8 py-6"
      style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.10)" }}
    >
      <div className="flex flex-col gap-y-2">
        <label className="text-heading-24 text-Gray-900">재료 정보</label>
        <span className="text-body-18 text-Gray-500">정보를 정확하게 입력하면 재료를 남기지 않을 수 있어요!</span>
      </div>

      {fields.map((field, i) => (
        <div className="flex gap-x-3" key={field.id}>
          <input
            className="w-[368px] rounded-[16px] bg-Gray-50 px-4 py-3 text-body-16"
            placeholder="양상추, 표고 버섯 등의 재료 이름"
            {...register(`ingredients.${i}.ingredient`, { required: true })}
          />
          <input
            placeholder="수량"
            {...register(`ingredients.${i}.amount`, { required: true })}
            className="w-[280px] rounded-[16px] bg-Gray-50 px-4 py-3 text-body-16"
          />
          <input
            placeholder="단위"
            {...register(`ingredients.${i}.unit`, { required: true })}
            className="w-[280px] rounded-[16px] bg-Gray-50 px-4 py-3 text-body-16"
          />
          <button
            type="button"
            className="items-center justify-center rounded-[5px] bg-Primary-50 py-3"
            onClick={() => remove(i)}
          >
            삭제
          </button>
        </div>
      ))}

      <div>
        <button
          type="button"
          className="flex w-[952px] items-center justify-center gap-2 rounded-[16px] bg-Primary-50 py-3"
          onClick={handleAddIngredientsForm}
        >
          <Image src={RecipeAddButton} alt="재료 추가버튼" width={24} height={24} />
          <span className="text-title-18 text-Gray-900">단계 추가하기</span>
        </button>
      </div>
    </div>
  );
};

export default IngredientsFields;
