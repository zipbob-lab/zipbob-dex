import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "프로필 정보를 확인 및 수정할 수 있는 페이지 입니다. 작성한 레시피와 댓글을 확인할 수 있습니다."
};

const MyPage = () => {
  return (
    <div className="m-auto flex flex-col gap-6 pt-[2rem] lg:max-w-[1024px] lg:pb-[10.70rem]">
      <h1 className="text-heading-28">마이페이지</h1>
      <section className="flex gap-20">
        <MyPageProfile />
        <div className="flex-1">
          <MyPostsCommentView />
        </div>
      </section>
    </div>
  );
};

export default MyPage;
