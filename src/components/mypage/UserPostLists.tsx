import { fetchUserPosts, fetchUserRecipesCount } from "@/serverActions/fetchRecipeDataFromSupabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import EmptyContent from "@/components/common/EmptyContent";
import type { UserPost } from "@/types/MyPage";
import DefaultFoodImage from "@images/myrecipe/imageFile.svg";
import DefaultProfileImage from "@images/default-profile.svg";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const UserPostLists = ({ userId }: { userId: string }) => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 4;

  // 전체 작성 글 개수 불러오기
  useEffect(() => {
    const loadPostCount = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        const count = await fetchUserRecipesCount(userId);
        setTotalPosts(count);
      } catch (error) {
        console.error("전체 레시피 개수 로드 실패:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
    loadPostCount();
  }, [userId]);

  // 페이지마다 포스트 개수 가져오기
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        const data = await fetchUserPosts(userId, currentPage, pageSize);
        if (data) setPosts(data);
      } catch (error) {
        console.error("레시피 데이터를 가져오는 중 에러 발생:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    loadPosts();
  }, [userId, currentPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (posts.length === 0)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 pt-6">
        <EmptyContent message="아직 나만의 레시피가 없어요!">
          <ul className="text-body-16 text-Gray-500">
            <li>· 꿀팁이 담긴 나만의 레시피를 남겨보세요.</li>
            <li>· 글을 남기면 경험치가 올라간답니다!</li>
          </ul>
        </EmptyContent>
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full ssm:h-[488px] md:h-[480px]">
        {posts.map((post) => (
          <div key={post.post_id} className="flex w-full items-end justify-between pb-5">
            <Link href={`/myrecipedetail/${post.post_id}`} className="flex flex-1">
              <div className="relative mr-5 h-[100px] w-[100px] rounded-md">
                <Image
                  src={post.recipe_img_done || DefaultFoodImage}
                  alt={post.recipe_title}
                  fill
                  sizes="100"
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col justify-start">
                <div className="mb-1 flex">
                  <Image src={FireFilledIcon} alt="레시피 난이도" />
                  <Image src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                  <Image src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                </div>
                <h3 className="ssm:text-title-14 md:text-title-16">{post.recipe_title}</h3>
                <div className="mt-3 flex flex-1 items-center gap-3">
                  <div className="relative flex flex-shrink-0 overflow-hidden rounded-full ssm:h-7 ssm:w-7 md:h-10 md:w-10">
                    <Image
                      src={post.user.user_img || DefaultProfileImage}
                      alt={post.user.user_nickname}
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-col gap-1 pr-3">
                    <span className="text-Gray-900 ssm:text-body-13 md:text-title-14">{post.user.user_nickname}</span>
                    <span className="text-Gray-900 ssm:text-body-12">{post.user.user_introduce}</span>
                  </div>
                </div>
              </div>
            </Link>
            <span className="flex gap-2">
              <LikeButton postId={post.post_id} />
              <ScrapButton postId={post.post_id} />
            </span>
          </div>
        ))}
      </div>
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalPosts}
        onPageChange={(page) => setCurrentPage(page)}
        className="min-w-[372px] gap-6"
        buttonClassName="px-10"
      />
    </div>
  );
};

export default UserPostLists;
