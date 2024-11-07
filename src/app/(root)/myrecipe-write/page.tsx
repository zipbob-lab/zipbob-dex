import InputField from "@/components/myRecipeWrite/InputField";
import { Suspense } from "react";

const MyRecipeWrite = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading</div>}>
        <InputField />
      </Suspense>
    </div>
  );
};

export default MyRecipeWrite;
