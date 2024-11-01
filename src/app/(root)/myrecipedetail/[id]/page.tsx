import RecipeDetailView from "@/components/myRecipeDetail/RecipeDetailView";
import { supabase } from "@/supabase/supabase";
import { Metadata } from "next";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data, error } = await supabase.from("TEST2_TABLE").select("recipe_title").eq("post_id", params.id).single();
  if (error) {
    console.error("메타데이터 오류", error.message);
    return {
      title: "메타데이터가 없습니다."
    };
  }
  return {
    title: `집밥도감 - ${data?.recipe_title}` || "집밥 도감"
  };
}

const MyRecipeDetail = ({ params }: Props) => {
  return (
    <div>
      <RecipeDetailView postId={params.id} />
    </div>
  );
};

export default MyRecipeDetail;
