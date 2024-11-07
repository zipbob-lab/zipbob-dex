import { supabase } from "@/supabase/supabase";

export const fetchRecipeDbData = async () => {
  const { data, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select("*")

    .order("created_at", { ascending: false });

  if (error) {
    console.error("레시피 데이터 오류", error);
    return;
  }

  return data;
};

// 유저 후기 글 불러오기
export const fetchUserPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select(
      `
      *,
      user:USER_TABLE (
        user_id,
        user_nickname,
        user_img,
        user_introduce,
        user_rank
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.log("게시물 불러오기 실패", error.message);

    return null;
  }
  return data;
};

// 사용자가 작성한 전체 레시피 개수 가져오기 함수
export const fetchUserRecipesCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase.from("MY_RECIPE_TABLE").select("*", { count: "exact" }).eq("user_id", userId);

  if (error) {
    console.error("레시피 개수를 가져오는 중 오류 발생:", error.message);
    return 0;
  }

  return count || 0;
};

export const fetchUserComments = async (userId: string) => {
  const { data: comments, error: commentsError } = await supabase
    .from("COMMENT_TABLE")
    .select("comment, created_at, post_id")
    .eq("user_id", userId)
    .eq("comment_active", true);

  // 댓글 개수 가져오기
  const { count, error: commentCountError } = await supabase
    .from("COMMENT_TABLE")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("comment_active", true);

  if (commentsError) {
    console.log("댓글 데이터 불러오기 실패", commentsError.message);
    return { comments: [], commentCount: 0 };
  }

  if (commentCountError) {
    console.error("댓글 개수를 가져오는 중 오류 발생:", commentCountError.message);
    return { comments, commentCount: 0 };
  }

  return { comments, commentCount: count || 0 };
};

// 단일 레시피 데이터 가져오기 함수
export const fetchRecipeByPostId = async (postId: string) => {
  const { data: recipe, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select("recipe_title, recipe_img_done, recipe_level")
    .eq("post_id", postId)
    .single();

  if (error) {
    console.log("레시피 데이터 불러오기 실패", error.message);
    return null;
  }

  return recipe;
};
