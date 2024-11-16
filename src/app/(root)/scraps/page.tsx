import ScrapPage from "@/components/scraps/ScrapPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "스크랩한 레시피",
  description: "스크랩한 레시피를 확인할 수 있는 페이지 입니다."
};

const Page = () => {
  return (
    <div>
      <ScrapPage />
    </div>
  );
};
export default Page;
