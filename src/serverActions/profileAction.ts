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

export const getUserProfile = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from("USER_TABLE").select("user_img").eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data[0].user_img;
};

export const getUserNickname = async (id: string) => {
  const { data, error } = await supabase.from("USER_TABLE").select("user_nickname").eq("user_id", id);

  if (error) {
    throw error;
  }

  return data[0].user_nickname;
};
