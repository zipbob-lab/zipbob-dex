"use client";
import { useFormContext } from "react-hook-form";

const RecipeInfoFields = () => {
  const { register } = useFormContext();
  return (
    <div className="flex max-w-[33rem] flex-col gap-y-5 md:max-w-[51.44rem] lg:max-w-[63.5rem]">
      <div className="flex flex-col gap-x-16 gap-y-[0.5rem] md:gap-y-[0.75rem] lg:flex-row lg:gap-y-[0rem]">
        {/* 카테고리 */}
        <h1 className="flex w-[120px] text-title-16 text-Gray-700 md:text-title-18">카테고리</h1>
        <div className="flex gap-x-3">
          <select
            {...register("recipeMethod", { required: true })}
            className="w-[18rem] rounded-[20px] border border-Gray-100 px-4 py-2 text-body-14 text-Gray-900 md:text-body-16 lg:w-[16.125rem]"
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
            className="w-[18rem] rounded-[20px] border border-Gray-100 px-4 py-2 text-body-14 text-Gray-900 md:text-body-16 lg:w-[16.125rem]"
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
      <div className="flex flex-col gap-x-[4rem] gap-y-[0.5rem] md:gap-y-[0.75rem] lg:flex-row">
        <h1 className="flex w-[120px] items-center text-title-16 text-Gray-700 md:text-title-18">레시피 제목</h1>
        <input
          placeholder="예)10분이면 완성하는 바질 로제 파스타"
          {...register("recipeTitle", { required: true })}
          className="input-focus w-full resize-none rounded-2xl bg-Gray-50 px-4 py-3 text-body-14 text-Gray-500 md:text-body-16 lg:w-[33rem]"
        />
      </div>
      {/* 요리 소개 */}
      <div className="flex flex-col gap-x-[4rem] gap-y-[0.5rem] md:gap-y-[0.75rem] lg:flex-row">
        <h1 className="flex w-[120px] items-center text-title-16 text-Gray-700 md:text-title-18">요리 소개</h1>
        <textarea
          className="input-focus h-[7.25rem] w-full resize-none rounded-2xl bg-Gray-50 px-4 py-3 text-body-14 text-Gray-500 md:text-body-16 lg:w-[33rem]"
          placeholder="레시피의 탄생배경, 특징을 적어주세요."
          {...register("recipeDescription", { required: true })}
        />
      </div>
    </div>
  );
};

export default RecipeInfoFields;
