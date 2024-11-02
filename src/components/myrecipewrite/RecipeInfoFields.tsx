"use client";
import { useFormContext } from "react-hook-form";

const RecipeInfoFields = () => {
  const { register } = useFormContext();
  return (
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
        <input placeholder="예)10분이면 완성하는 바질 로제 파스타" {...register("recipeTitle", { required: true })} />
      </div>
      <div className="flex mb-5 gap-10">
        <label className="font-bold">요리 소개</label>
        <textarea
          className="resize-none"
          placeholder="레시피의 탄생배경, 특징을 적어주세요."
          {...register("recipeDescription", { required: true })}
        />
      </div>
    </div>
  );
};

export default RecipeInfoFields;
