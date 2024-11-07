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
    staleTime: 60
  });

  if (isCommentPending) {
    return <div>최근 후기를 가져오는중입니다</div>;
  }

  if (isCommentError) {
    return <div>최근 후기를 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="w-full px-[5.5rem]">
      <h2 className="mt-2 text-center font-yangjin text-[2.25rem] font-medium leading-[105%] tracking-[-0.18px] text-Primary-300">
        현재 다른 사람들이 도전하고 있는 레시피
      </h2>
      <div className="mt-[3.75rem] grid grid-cols-2 gap-x-6 gap-y-4">
        {comments?.map((comment) => <RecentCommentCard key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
};

export default RecentComment;
