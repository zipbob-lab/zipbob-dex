"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";
import { v4 as uuidv4 } from "uuid";
import { getUserId } from "@/serverActions/profileAction";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  postId: string;
}

const LikeButton = ({ postId }: LikeButtonProps) => {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeStatusDb, setLikeStatusDb] = useState<string | null>(null);
  const [loginSessionId, setLoginSessionId] = useState<string | null>(null);
  const [isLoginModal, setIsLoginModal] = useState<boolean>(false);

  const router = useRouter();

  // 세션 아이디 가져오고 좋아요 상태 확인
  useEffect(() => {
    const getSessionId = async () => {
      const userId = await getUserId();
      setLoginSessionId(userId);
      fetchLikeStatus(userId);
    };
    getSessionId();
  }, []);

  useEffect(() => {
    if (loginSessionId) {
      fetchLikeStatus(loginSessionId);
    }
  }, [loginSessionId]);

  const fetchLikeStatus = async (userId: string | null) => {
    // 로그인 시 내 좋아요 상태 가져오기
    if (userId) {
      const { data: likeStatusData, error: likeStatusError } = await supabase
        .from("LIKE_TABLE")
        .select("like_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (likeStatusError) {
        console.error("좋아요 상태 오류:", likeStatusError.message);
      }

      if (likeStatusData?.like_id) {
        setLikeStatusDb(likeStatusData.like_id);
        setIsLike(true);
      } else {
        setLikeStatusDb(null);
        setIsLike(false);
      }
    }

    // 좋아요 총 개수 가져오기
    const { data, error } = await supabase.from("TEST2_TABLE").select("like_count").eq("post_id", postId).maybeSingle();

    if (error) {
      console.error("좋아요 개수 가져오기 오류:", error.message);
    } else {
      setLikeCount(data?.like_count || 0);
    }
  };

  const handleToggleLikeButton: React.MouseEventHandler<HTMLButtonElement> = async (e): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (!loginSessionId) {
      setIsLoginModal(true);
      return;
    }

    if (likeStatusDb) {
      // 좋아요 취소
      const { error: deleteError } = await supabase
        .from("LIKE_TABLE")
        .delete()
        .match({ post_id: postId, user_id: loginSessionId });

      if (deleteError) {
        console.error("좋아요 취소 실패:", deleteError.message);
        return;
      }

      await supabase
        .from("TEST2_TABLE")
        .update({ like_count: likeCount - 1 })
        .eq("post_id", postId);

      setLikeStatusDb(null);
      setIsLike(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // 좋아요 추가
      const newLikeId = uuidv4();
      const { error: insertError } = await supabase.from("LIKE_TABLE").insert({
        post_id: postId,
        user_id: loginSessionId,
        like_id: newLikeId
      });

      if (insertError) {
        console.error("좋아요 추가 실패:", insertError.message);
        return;
      }

      await supabase
        .from("TEST2_TABLE")
        .update({ like_count: likeCount + 1 })
        .eq("post_id", postId);

      setLikeStatusDb(newLikeId);
      setIsLike(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  // 로그인 모달 닫기
  const handleCloseModal: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoginModal(false);
  };

  return (
    <>
      <button onClick={(e) => handleToggleLikeButton(e)}>
        {isLike ? "💛" : "🤍"} {likeCount}
      </button>
      {/* 삭제 확인 모달 */}
      {isLoginModal && (
        <div
          className="fixed inset-0 items-center justify-center bg-black bg-opacity-45"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="rounded-lg bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-lg font-bold">로그인이 필요한 서비스예요!</h1>
              <span>간편하게 로그인하고 좀 더 다양한 기능을 즐겨요</span>
              <div className="flex flex-row gap-3">
                <button className="rounded-lg bg-orange-400 p-2 text-white" onClick={handleCloseModal}>
                  닫기
                </button>
                <button className="rounded-lg bg-orange-400 p-2 text-white" onClick={() => router.push("/login")}>
                  로그인 하러 가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LikeButton;
