import { createClient } from "@/supabase/server";
import { fetchRecipeData } from "./fetchRecipeData";
import { v4 as uuidv4 } from "uuid";

export const saveRecipeDataSupabase = async () => {
  const recipeData = await fetchRecipeData();
  console.log("레시피 데이터:", recipeData);

  const saveData = recipeData.COOKRCP01.row.map((recipeData: any) => ({
    user_id: "b8d5e70b-c868-43fc-ac7d-e0601de00d0b",
    post_id: uuidv4(),
    recipe_seq: recipeData.RCP_SEQ,
    recipe_title: recipeData.RCP_NM,
    recipe_ingredients: recipeData.RCP_PARTS_DTLS,
    recipe_img_doing: Array.from(
      { length: 20 },
      (_, index) =>
        recipeData[
          `MANUAL_IMG${String(index + 1)
            .padStart(2, "0")
            .replace(/"/g, "")}`
        ]
    ).filter(Boolean),
    recipe_img_done: recipeData.ATT_FILE_NO_MK?.replace(/"/g, ""),
    recipe_manual: Array.from(
      { length: 20 },
      (_, index) => recipeData[`MANUAL${String(index + 1).padStart(2, "0")}`]
    ).filter(Boolean),
    recipe_type: recipeData.RCP_PAT2,
    recipe_method: recipeData.RCP_WAY2,
    // recipe_level:,
    recipe_kcal: recipeData.INFO_ENG,
    recipe_description: recipeData.RCP_NA_TIP,
    created_at: new Date(),
    updated_at: new Date()
  }));
  const serverClient = createClient();

  const { error } = await serverClient.from("TEST2_TABLE").insert(saveData);

  if (error) {
    console.error("저장오류:", error.message);
  } else {
    console.log("저장완");
  }
};
// saveRecipeDataSupabase();
