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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getSessionId = async () => {
      const sessionId = await getUserId();
      setLoginSessionId(sessionId || null);
    };
    getSessionId();
  }, []);

  // 수정
  const handleModifyPost = () => {
    router.push(`/myrecipewrite?postId=${postId}`);
  };

  // 삭제
  const handleDeletePost = async () => {
    const { error: deleteError, count } = await supabase
      .from("TEST2_TABLE")
      .delete({ count: "exact" }) // 실제 삭제가 된 행의 개수를 반환
      .eq("post_id", postId)
      .eq("user_id", loginSessionId);

    if (deleteError || count === 0) {
      console.error(deleteError?.message);
      console.log("레시피 삭제 실패");
      return;
    }

    console.log("레시피 삭제 성공");
    router.push("/myrecipedetail");
    router.refresh();
  };

  return (
    <>
      {userId === loginSessionId && (
        <div className="mt-4 flex gap-2">
          <button className="rounded bg-orange-400 p-2 text-white" onClick={handleModifyPost}>
            수정
          </button>
          <button className="rounded bg-red-500 p-2 text-white" onClick={() => setIsDeleteModalOpen(true)}>
            삭제
          </button>
        </div>
      )}
      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 items-center justify-center bg-black bg-opacity-45">
          <div className="rounded-lg bg-white p-5">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-lg font-bold">레시피를 정말로 삭제하시겠어요?</h1>
              <span>삭제된 레시피는 복구할 수 없어요!</span>
              <div className="flex flex-row gap-3">
                <button className="rounded-lg bg-orange-400 p-2 text-white" onClick={() => setIsDeleteModalOpen(false)}>
                  취소하기
                </button>
                <button className="rounded-lg bg-orange-400 p-2 text-white" onClick={handleDeletePost}>
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ModifyDeletePost;
