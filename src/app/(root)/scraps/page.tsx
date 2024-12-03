import AuthRequiredPage from "@/components/common/AuthRequiredPage";
import ScrapPage from "@/components/scraps/ScrapPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "스크랩한 레시피",
  description: "스크랩한 레시피를 확인할 수 있는 페이지 입니다."
};

const Scraps = () => {
  return (
    <div>
      <AuthRequiredPage>
        <ScrapPage />
      </AuthRequiredPage>
    </div>
  );
};
export default Scraps;
