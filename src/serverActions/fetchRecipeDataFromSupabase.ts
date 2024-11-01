import { supabase } from "@/supabase/supabase";

export const fetchRecipeDbData = async () => {
  const { data, error } = await supabase
    .from("TEST2_TABLE")
    .select("*")
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("레시피 데이터 오류", error);
    return;
  }

  // console.log("레시피 데이터", data);
  return data;
};
