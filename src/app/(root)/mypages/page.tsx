import AuthRequiredPage from "@/components/common/AuthRequiredPage";
import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "프로필 정보를 확인 및 수정할 수 있는 페이지 입니다. 작성한 레시피와 댓글을 확인할 수 있습니다."
};

const MyPage = () => {
  return (
    <AuthRequiredPage>
      <div className="m-auto flex flex-col gap-6 py-[2rem] ssm:max-w-[337px] sm:max-w-[336px] md:max-w-[688px] lg:max-w-[1024px] lg:pb-[10.70rem]">
        <h1 className="ssm:text-heading-20 md:text-heading-24 lg:text-heading-28">마이페이지</h1>
        <div className="flex gap-12 ssm:flex-col md:flex-row md:gap-6 lg:flex-row lg:gap-20">
          <MyPageProfile />

          <div className="lg:flex-1">
            <MyPostsCommentView />
          </div>
        </div>
      </div>
    </AuthRequiredPage>
  );
};

export default MyPage;
