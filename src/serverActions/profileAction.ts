import browserClient from "@/supabase/client";

export const getUserId = async () => {
  const { data } = await browserClient.auth.getUser();
  const userId = data.user?.id ?? null;
  return userId;
};
