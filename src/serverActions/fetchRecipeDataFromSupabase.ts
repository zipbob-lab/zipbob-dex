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
export const fetchUserPosts = async (userId: string, page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

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
    .eq("user_id", userId)
    .range(start, end);

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

// 유저 후기 댓글 불러오기 함수 + 페이지네이션 추가
export const fetchUserComments = async (userId: string, page = 1, pageSize = 1000) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // 댓글 데이터 가져오기
  const { data: comments, error: commentsError } = await supabase
    .from("COMMENT_TABLE")
    .select("comment, created_at, post_id")
    .eq("user_id", userId)
    .eq("comment_active", true)
    .range(start, end);

  // 댓글 개수 가져오기
  const { count, error: commentCountError } = await supabase
    .from("COMMENT_TABLE")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("comment_active", true);

  if (commentsError) {
    console.error("댓글 데이터 불러오기 실패:", commentsError.message);
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
