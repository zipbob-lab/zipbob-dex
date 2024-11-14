import { supabase } from "@/supabase/supabase";

export const uploadProfileImage = async (userId: string, file: File): Promise<string | null> => {
  const { error } = await supabase.storage
    .from("zipbob_storage")
    .upload(`userProfileFolder/${userId}`, file, { upsert: true });

  if (error) {
    console.error("사진 업로드 실패", error);
    return null;
  }

  // 업로드된 이미지의 URL 생성
  const timestamp = new Date().getTime();
  const profileImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/zipbob_storage/userProfileFolder/${userId}?t=${timestamp}`;
  return profileImageUrl;
};
