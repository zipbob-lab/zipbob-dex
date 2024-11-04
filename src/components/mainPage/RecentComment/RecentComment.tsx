"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecentCommentCard from "./RecentCommentCard";

const RecentComment = () => {
  const fetchRecentComments = async () => {
    const { data, error } = await browserClient
      .from("COMMENT_TABLE")
      .select("*")
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
    <div className="mt-10">
      <h1 className="text-center text-[1.6rem] text-Primary-300">현재 다른 사람들이 도전하고 있는 레시피</h1>
      <div className="grid grid-cols-2 p-5">
        {comments?.map((comment) => <RecentCommentCard key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
};

export default RecentComment;
