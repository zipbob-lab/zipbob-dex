import { supabase } from "@/supabase/supabase";

export const fetchRecipeDbData = async () => {
  const { data, error } = await supabase.from("TEST2_TABLE").select("*");

  if (error) {
    console.error("레시피 데이터 오류", error.message);
    return;
  }

  console.log("레시피 데이터", data);
  console.log("레시피 데이터 갯수", data.length);
  return data;
};

// fetchRecipeDbData();
