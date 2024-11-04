import InputAA from "@/components/myrecipewrite/InputField";
import { Suspense } from "react";

const MyRecipeWrite = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading</div>}>
        <InputAA />
      </Suspense>
    </div>
  );
};

export default MyRecipeWrite;
