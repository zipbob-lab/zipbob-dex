import TagFilter from "@/components/fridgeListPage/FridgeFilter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "냉장고 탐험",
  description: "재료 조건을 통해 원하는 레시피를 찾아 볼수 있습니다."
};

const FridgeListPage = () => {
  return (
    <div>
      <TagFilter />
    </div>
  );
};

export default FridgeListPage;
