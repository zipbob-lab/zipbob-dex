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
    queryFn: fetchRecentComments
  });

  if (isCommentPending) {
    return <div>최근 후기를 가져오는중입니다</div>;
  }

  if (isCommentError) {
    return <div>최근 후기를 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="w-[1024px] py-[5rem] text-center">
      <h2 className="font-wiggle text-main-30 text-[#834D27]">현재 다른 사람들이 도전하고 있는 레시피</h2>
      <p className="mt-4 text-body-18 text-Gray-600">최근에 올라온 후기를 확인해 봐요!</p>
      <div className="mt-[3.75rem] grid grid-cols-2 gap-x-4 gap-y-5">
        {comments?.map((comment) => <RecentCommentCard key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
};

export default RecentComment;
