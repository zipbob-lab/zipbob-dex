import InputField from "@/components/myrecipewrite/InputField";
import { Suspense } from "react";

const MyRecipeWrite = () => {
  return (
    <div>
      <Suspense>
        <InputField />
      </Suspense>
    </div>
  );
};

export default MyRecipeWrite;
