"use client";
import { getUserId } from "@/serverActions/profileAction";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import TrashCan from "@images/trashCan.svg";
import Pen from "@images/pen.svg";
import Image from "next/image";
import GrayVar from "@images/grayVar.svg";
import { useRouter } from "next/navigation";

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
      .from("MY_RECIPE_TABLE")
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
        <div className="flex flex-row">
          <div className="flex flex-row gap-[10px] px-3 py-2">
            <Image src={Pen} alt="수정" width={20} height={20}></Image>
            <button className="text-body-14 text-Gray-500" onClick={handleModifyPost}>
              수정하기
            </button>
          </div>

          <Image src={GrayVar} alt="회색바" />

          <div className="flex flex-row gap-[10px] px-3 py-2">
            <Image src={TrashCan} alt="삭제" width={20} height={20}></Image>
            <button className="p-2 text-body-14 text-SystemColor-Red" onClick={() => setIsDeleteModalOpen(true)}>
              삭제하기
            </button>
          </div>
        </div>
      )}
      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="rounded-2xl bg-white px-10 py-8"
            style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.20)" }}
          >
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-title-20">레시피를 정말로 삭제하시겠어요?</h1>
              <span className="pt-2 text-center text-body-14 text-Gray-500">삭제된 레시피는 복구할 수 없어요!</span>
              <div className="mt-5 flex gap-3">
                <button
                  className="flex min-w-[120px] items-center justify-center gap-1 rounded-2xl border border-Primary-300 bg-white px-4 py-2 text-title-16 text-Primary-300"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  취소하기
                </button>
                <button
                  className="flex min-w-[120px] items-center justify-center gap-1 rounded-2xl bg-orange-400 px-4 py-2 text-title-16 text-white"
                  onClick={handleDeletePost}
                >
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
