"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecentCommentCard from "./RecentCommentCard";

const RecentComment = () => {
  const fetchRecentComments = async () => {
    const { data, error } = await browserClient
      .from("COMMENT_TABLE")
      .select("*")
      .eq("comment_active", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("최근 후기를 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: comments,
    isPending: isCommentPending,
    isError: isCommentError
  } = useQuery({
    queryKey: ["recentComments"],
    queryFn: fetchRecentComments,
    staleTime: 0
  });

  if (isCommentPending) {
    return <div>최근 후기를 가져오는중입니다</div>;
  }

  if (isCommentError) {
    return <div>최근 후기를 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="w-[21rem] pb-[5.81rem] text-center md:w-[46rem] md:pb-[5.87rem] lg:pb-[2.87rem] xl:w-[64rem] xl:py-[5rem]">
      <h2 className="font-wiggle text-main-20 text-[#834D27] md:text-main-30">
        현재 다른 사람들이 도전하고 있는 레시피
      </h2>
      <p className="mt-3 text-body-16 text-Gray-600 md:mt-4 md:text-body-18">최근에 올라온 후기를 확인해 봐요!</p>
      <div className="mt-[1.75rem] flex flex-col gap-4 md:mt-[2rem] md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-5 xl:mt-[3.75rem]">
        {comments?.map((comment) => <RecentCommentCard key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
};

export default RecentComment;
