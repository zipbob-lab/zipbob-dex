import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";
import React from "react";

const MyPage = () => {
  return (
    <div className="flex flex-col gap-6 justify-start items-start min-h-screen px-10 py-5">
      <h1 className="font-bold text-3xl text-left mb-4">마이페이지</h1>
      <div className="flex gap-8 w-full mx-auto">
        <MyPageProfile />
        <MyPostsCommentView />
      </div>
    </div>
  );
};

export default MyPage;
