import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";
import React from "react";
import Image from "next/image";
import ForkKnife from "@images/forkKnife.svg";

const MyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-52 py-16">
      <div className="flex w-full justify-start">
        <h1 className="mb-4 flex items-center gap-3 text-left font-yangjin text-4xl text-Primary-300">
          <Image src={ForkKnife} alt="포크 나이프" width={45} height={45} />
          마이페이지
        </h1>
      </div>
      <div className="flex w-full gap-9">
        <MyPageProfile />
        <div className="flex-1">
          <MyPostsCommentView />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
