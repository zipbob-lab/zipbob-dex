import browserClient from "@/supabase/client";
export const getUserId = async (): Promise<string | null> => {
  const { data, error } = await browserClient.auth.getUser();

  if (error) {
    console.log("user 정보 불러오기를 실패했습니다.", error.message);
  }

  const userId = data.user?.id ?? null;
  return userId;
};

// 유저 정보를 불러오는 함수
export const fetchUserProfile = async (): Promise<{
  user_id: string;
  user_nickname: string;
  user_img: string;
  user_email: string;
  user_exp: number;
  user_rank: number;
} | null> => {
  const userId = await getUserId();
  if (!userId) return null;

  const { data, error } = await browserClient
    .from("USER_TABLE")
    .select("user_id,user_nickname,user_img,user_email,user_exp,user_rank")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log("user 프로필 불러오기 실패", error.message);
    return null;
  }
  console.log("user_id 값 확인:", data.user_id);
  return data;
};
