import InputField from "@/components/myrecipewrite/InputField";
import { saveRecipeDataSupabase } from "../api/saveRecipeDataSupabase";

const MyRecipeWrite = () => {
  // fetchRecipeData();
  saveRecipeDataSupabase();
  return (
    <div>
      <InputField />
    </div>
  );
};

export default MyRecipeWrite;
