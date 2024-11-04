"use client";
import { useFieldArray, useFormContext } from "react-hook-form";

const IngredientsFields = () => {
  const { register, control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "ingredients"
  });

  const handleAddIngredientsForm = () => {
    append({ ingredient: "", amount: "", unit: "" }, { shouldFocus: false });
  };

  return (
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
  );
};

export default IngredientsFields;
