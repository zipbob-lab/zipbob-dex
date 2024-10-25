import { supabase } from "@/supabase/supabase";

export const fetchRecipeDataFromSupabase = async (postId?: string) => {
  const { data, error } = await supabase.from("TEST_TABLE").select("*").eq("post_id", postId);
  console.log(postId);
  if (error) {
    console.log("레시피 데이터 불러오기 중 오류 발생", error.message);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log("해당 post_id에 맞는 데이터가 없습니다.");
    return null; // 또는 빈 객체, 사용자 알림 등 적절한 반환 처리
  }
  console.log(data);
  return data;
};
