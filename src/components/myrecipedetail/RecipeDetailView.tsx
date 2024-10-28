import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import React from "react";

const RecipeDetailView = async () => {
  const { data, error } = await supabase
    .from("TEST2_TABLE")
    .select(`*, USER_TABLE(user_nickname, user_introduce, user_img)`)
    .eq("post_id", "e5318adc-dd5e-4e01-8d75-b32cf7ad4834")
    .single();

  const userInfo = data.USER_TABLE;

  if (error) {
    console.error("데이터 불러오기 실패  ", error.message);
  } else {
    console.log("데이터 불러오기 성공", data);
  }

  console.log("유저인포", userInfo);

  return (
    <div className="bg-gray-400 flex flex-col justify-center items-center gap-5">
      {/* 요리 완성 사진 & 설명 */}
      <div className="bg-pink-400 flex justify-between w-1/3 p-5 gap-5">
        <div className="w-48 h-48 rounded-lg bg-gray-500 relative overflow-hidden">
          <Image src={data.recipe_img_done} alt="완성 이미지" fill={true} objectFit="cover" />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">{data.recipe_title}</h1>
            <span>{data.recipe_description}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex bg-purple-300 gap-3">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-gray-500 relative overflow-hidden">
                <Image src={userInfo.user_img} alt="완성 이미지" fill={true} objectFit="cover" />
              </div>
              <div>
                <div>{userInfo.user_nickname}</div>
                <div>{userInfo.user_introduce}</div>
              </div>
            </div>
            <div className="flex flex-row justify-end items-end bg-lime-600">
              <div>좋아요 버튼</div>
              <div>스크랩 버튼</div>
              <div>공유 버튼</div>
            </div>
          </div>
        </div>
      </div>

      {/* 재료 목록 */}
      <div className="flex flex-col bg-yellow-400  w-1/3 p-5 gap-5">
        <h1 className="text-2xl font-bold">재료 목록</h1>
        <div>
          <div>{data.recipe_ingredients}</div>
          <div>단위</div>
        </div>
      </div>

      {/* 조리 순서 */}
      <div className="flex flex-col  bg-cyan-400  w-1/3 p-5 gap-5">
        <div>
          <h1 className="text-2xl font-bold">조리 순서</h1>
        </div>
        <div className="flex flex-col gap-4">
          {data.recipe_img_doing.map((_, index: number) => (
            <div key={index} className="p-4  flex gap-5">
              <h2 className="mt-2 text-xl font-semibold">{index + 1}</h2>
              <Image
                className="rounded-sm object-scale-down"
                width={80}
                height={80}
                src={data.recipe_img_doing[index]}
                alt={`매뉴얼 이미지 ${index + 1}`}
              />
              <p className="text-gray-500">{data.recipe_manual[index]}</p>
            </div>
          ))}
          {/* <div>매뉴얼사진</div>
          <div>매뉴얼 설명</div> */}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailView;
