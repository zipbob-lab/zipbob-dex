import browserClient from "@/supabase/client";
import { supabase } from "@/supabase/supabase";

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
  user_introduce: string;
} | null> => {
  const {
    data: { user },
    error: userError
  } = await browserClient.auth.getUser();

  if (userError || !user) {
    console.error("사용자 정보를 가져올 수 없거나 로그인 상태가 아닙니다:", userError?.message);
    return null;
  }

  const userId = user.id;

  const { data, error } = await browserClient.from("USER_TABLE").select("*").eq("user_id", userId).single();

  if (error) {
    console.log("user 프로필 불러오기 실패:", error.message);
    return null;
  }

  return data;
};

export const getUserProfile = async () => {
  const { data } = await browserClient.auth.getUser();

  const userProfile = data.user?.user_metadata.avatar_url ?? null;
  return userProfile;
};
