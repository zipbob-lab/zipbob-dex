import RecipeDetailView from "@/components/myrecipedetail/RecipeDetailView";
import { supabase } from "@/supabase/supabase";
import { Metadata } from "next";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { data, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select("recipe_title")
    .eq("post_id", params.id)
    .single();
  if (error) {
    console.error("메타데이터 오류", error.message);
    return {
      title: "메타데이터가 없습니다."
    };
  }
  return {
    title: `집밥도감 - ${data?.recipe_title}` || "집밥 도감"
  };
};

export const generateStaticParams = async () => {
  const { data, error } = await supabase.from("MY_RECIPE_TABLE").select("post_id").not("recipe_seq", "is", null);

  if (error) {
    console.error("레시피&사용자정보를 불러오지 못했습니다.:", error.message);
    return [];
  }

  return (
    data?.map((recipedata) => ({
      id: recipedata.post_id
    })) || []
  );
};

const MyRecipeDetail = ({ params }: Props) => {
  return (
    <div className="bg-[#fbfbfb]">
      <RecipeDetailView postId={params.id} />
    </div>
  );
};

export default MyRecipeDetail;
