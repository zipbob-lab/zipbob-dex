import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";
import React from "react";

const MyPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-start justify-start gap-6 px-10 py-5">
      <h1 className="mb-4 text-left text-3xl font-bold">마이페이지</h1>
      <div className="mx-auto flex w-full gap-8">
        <MyPageProfile />
        <MyPostsCommentView />
      </div>
    </div>
  );
};

export default MyPage;
