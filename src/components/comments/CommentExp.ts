import { supabase } from "@/supabase/supabase";

interface CommentExpInterface {
  userId: string | null;
  postId: string | null;
}

export const CommentExp = async ({ userId, postId }: CommentExpInterface) => {
  console.log("꾸");
  // 코멘트 테이블에 기존 코멘트가 있는 지 확인
  const { data, error } = await supabase
    .from("COMMENT_TABLE")
    .select("comment_id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (error) {
    console.error("기존 댓글 조회 에러 : ", error.message);
    return;
  }

  if (!data) {
    const { data: userData, error: userError } = await supabase
      .from("USER_TABLE")
      .select("user_exp")
      .eq("user_id", userId)
      .single();
    if (userError) {
      console.error("유저 경험치 조회 에러 : ", userError.message);
      return;
    }

    const updatedExp = (userData?.user_exp || 0) + 10;
    const { error: expUpdateError } = await supabase
      .from("USER_TABLE")
      .update({ user_exp: updatedExp })
      .eq("user_id", userId);

    if (expUpdateError) {
      console.error("경험치 업데이트 에러 : ", expUpdateError.message);
      return;
    }
  }
};
