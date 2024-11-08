import { supabase } from "@/supabase/supabase";

export const fetchRecipeWithUserInfo = async (postId: string) => {
  const { data, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select(`*, USER_TABLE(user_id, user_nickname, user_introduce, user_img, user_rank)`)
    .eq("post_id", postId)
    .single();

  if (error) {
    console.error("레시피&사용자정보를 불러오지 못했습니다.:", error.message);
    throw error;
  }

  return data;
};
