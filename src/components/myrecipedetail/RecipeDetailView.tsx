import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import React from "react";

import Comments from "../comments/Comments";
import Likebutton from "../common/button/LikeButton";
import ModifyDeletePost from "./ModifyDeletePost";
import { RecipeForm } from "../myrecipewrite/InputField";

interface RecipeDetailViewProps {
  postId: string;
}

const RecipeDetailView = async ({ postId }: RecipeDetailViewProps) => {
  const { data, error } = await supabase
    .from("TEST2_TABLE")
    .select(`*, USER_TABLE(user_id,user_nickname, user_introduce, user_img)`)
    .eq("post_id", postId)
    .single();
  const userInfo = data.USER_TABLE;

  if (error) {
    console.error("데이터 불러오기 실패  ", error.message);
  } else {
    console.log("데이터 불러오기 성공");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 bg-gray-400 p-5">
      {/* 요리 완성 사진 & 설명 */}
      <div className="flex w-1/3 justify-between gap-5 bg-pink-400 p-5">
        <div className="relative h-52 w-52 overflow-hidden rounded-lg bg-gray-500">
          <Image src={data.recipe_img_done} alt="완성 이미지" fill={true} style={{ objectFit: "cover" }} />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">{data.recipe_title}</h1>
            <span>{data.recipe_description}</span>
          </div>
          <div className="flex justify-between">
            {/* 유저 사진 */}
            <div className="flex gap-3 bg-purple-300">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-500">
                <Image
                  src={userInfo.user_img}
                  alt="완성 이미지"
                  fill={true}
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* 유저 정보 */}
              <div className="flex flex-col">
                <div>
                  <span className="font-bold">아이콘자리</span>
                  <span className="font-bold">{userInfo.user_nickname}</span>
                </div>
                <span>{userInfo.user_introduce}</span>
              </div>
            </div>
            <div className="flex flex-row items-end justify-end bg-lime-600">
              <div>
                <Likebutton postId={postId} />
              </div>
              <div>스크랩</div>
              <div>공유 버튼</div>
            </div>
            <ModifyDeletePost postId={postId} userId={userInfo.user_id} />
          </div>
        </div>
      </div>

      {/* 재료 목록 */}
      <div className="flex w-1/3 flex-col gap-5 bg-yellow-400 p-5">
        <h1 className="text-2xl font-bold">재료 목록</h1>
        <div>
          {typeof data.recipe_ingredients === "string"
            ? data.recipe_ingredients
            : Array.isArray(data.recipe_ingredients)
              ? data.recipe_ingredients.map((item: RecipeForm, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.ingredient}</span>
                    <span>
                      {item.amount}
                      {item.unit}
                    </span>
                  </div>
                ))
              : "데이터를 불러올 수 없습니다."}
        </div>
      </div>

      {/* 조리 순서 */}
      <div className="flex w-1/3 flex-col gap-5 bg-cyan-400 p-5">
        <div>
          <h1 className="text-2xl font-bold">조리 순서</h1>
        </div>
        <div className="flex flex-col gap-4">
          {data.recipe_img_doing.map((_: string, index: number) => (
            <div key={index} className="flex gap-5 p-4">
              <h2 className="mt-2 text-xl font-semibold">{index + 1}</h2>
              <Image
                className="rounded-sm object-scale-down"
                width={150}
                height={150}
                src={data.recipe_img_doing[index]}
                alt={`매뉴얼 이미지 ${index + 1}`}
              />
              <p className="text-gray-500">{data.recipe_manual[index]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 gap-5">
        <Comments postId={postId} />
      </div>
    </div>
  );
};

export default RecipeDetailView;
