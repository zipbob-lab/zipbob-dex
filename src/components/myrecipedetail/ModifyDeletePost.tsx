"use client";
import { getUserId } from "@/serverActions/profileAction";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ModiDeleButtonProps {
  postId: string;
  userId: string;
}

const ModifyDeletePost = ({ postId, userId }: ModiDeleButtonProps) => {
  const [loginSessionId, setLoginSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSessionId = async () => {
      const sessionId = await getUserId();
      setLoginSessionId(sessionId || null);
      console.log("세션", sessionId);
    };
    getSessionId();
  }, []);

  // 수정
  const handleModifyPost = () => {
    alert("수정");
  };

  // 삭제
  const handleDeletePost = async (postId: string) => {
    if (!loginSessionId) {
      alert("로그인 해주세요.");
      return;
    }

    const { error: deleteError, count } = await supabase
      .from("TEST2_TABLE")
      .delete({ count: "exact" }) // 실제 삭제가 된 행의 개수를 반환
      .eq("post_id", postId)
      .eq("user_id", loginSessionId);

    if (deleteError || count === 0) {
      console.error(deleteError?.message);
      alert("레시피 삭제 실패");
      return;
    }

    alert("레시피 삭제 성공!");
    router.push("/myrecipedetail");
    router.refresh();
  };

  return (
    <>
      {userId === loginSessionId && (
        <div className="flex gap-2 mt-4">
          <button className="bg-orange-400 p-2 rounded text-white" onClick={handleModifyPost}>
            수정
          </button>
          <button className="bg-red-500 p-2 rounded text-white" onClick={() => handleDeletePost(postId)}>
            삭제
          </button>
        </div>
      )}
    </>
  );
};
export default ModifyDeletePost;
