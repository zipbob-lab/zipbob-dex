import { supabase } from "@/supabase/supabase";

export const fetchRecipeDbData = async () => {
  const { data, error } = await supabase.from("TEST_TABLE").select("*");

  if (error) {
    console.error("레시피 데이터 오류", error);
    return;
  }

  console.log("레시피 데이터", data);
  console.log("레시피 데이터 갯수", data.length);
  return data;
};

// fetchRecipeDbData();
