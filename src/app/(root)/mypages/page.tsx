import MyPageProfile from "@/components/mypage/MyPageProfile";
import MyPostsCommentView from "@/components/mypage/MyPostsCommentView";

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
