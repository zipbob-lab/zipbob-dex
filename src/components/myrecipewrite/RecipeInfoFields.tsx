"use client";
import { useFormContext } from "react-hook-form";

const RecipeInfoFields = () => {
  const { register } = useFormContext();
  return (
    <div className="flex w-[712px] flex-col gap-y-5">
      <div className="flex gap-x-16">
        {/* 카테고리 */}
        <h1 className="flex w-[120px] text-title-18 text-Gray-700">카테고리</h1>
        <div className="flex gap-x-3">
          <select
            {...register("recipeMethod", { required: true })}
            className="max-w-[258px] rounded-[20px] border border-Gray-100 px-4 py-2 text-body-16 text-Gray-900"
          >
            <option value="boil">끓이기</option>
            <option value="roast">굽기</option>
            <option value="frying">튀기기</option>
            <option value="steaming">찌기</option>
            <option value="stirfry">볶기</option>
            <option value="other">기타</option>
          </select>
          <select
            {...register("recipeType", { required: true })}
            className="w-[258px] rounded-[20px] border border-Gray-100 px-4 py-2 text-body-16 text-Gray-900"
          >
            <option value="bob">밥</option>
            <option value="soup">국&찌개</option>
            <option value="banchan">반찬</option>
            <option value="onefood">일품</option>
            <option value="desert">후식</option>
            <option value="other">기타</option>
          </select>
        </div>
      </div>

      {/* 레시피 제목 */}
      <div className="flex gap-x-16">
        <h1 className="flex w-[120px] items-center text-title-18 text-Gray-700">레시피 제목</h1>
        <input
          placeholder="예)10분이면 완성하는 바질 로제 파스타"
          {...register("recipeTitle", { required: true })}
          className="w-[528px] resize-none rounded-2xl bg-Gray-50 px-4 py-3 text-body-16 text-Gray-500  input-focus"
        />
      </div>
      {/* 요리 소개 */}
      <div className="flex gap-x-16">
        <h1 className="flex w-[120px] items-center text-title-18 text-Gray-700">요리 소개</h1>
        <textarea
          className="h-[116px] w-[528px] resize-none rounded-2xl bg-Gray-50 px-4 py-3 text-body-16 text-Gray-500  input-focus"
          placeholder="레시피의 탄생배경, 특징을 적어주세요."
          {...register("recipeDescription", { required: true })}
        />
      </div>
    </div>
  );
};

export default RecipeInfoFields;
