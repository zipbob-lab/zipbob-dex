import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";

const MyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-52 py-16">
      <div className="flex w-full justify-start">
        <h1 className="py-8 text-heading-28">마이페이지</h1>
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
