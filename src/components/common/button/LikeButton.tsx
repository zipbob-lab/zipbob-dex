"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";
import { v4 as uuidv4 } from "uuid";
import { getUserId } from "@/serverActions/profileAction";

interface LikeButtonProps {
  postId: string;
}

const LikeButton = ({ postId }: LikeButtonProps) => {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeStatusDb, setLikeStatusDb] = useState<string | null>(null);
  const [loginSessionId, setLoginSessionId] = useState<string | null>(null);

  // 세션 아이디 가져오고 좋아요 상태 확인
  useEffect(() => {
    const getSessionId = async () => {
      const userId = await getUserId();
      setLoginSessionId(userId);
    };
    getSessionId();
  }, []);

  useEffect(() => {
    if (loginSessionId) {
      fetchLikeStatus(loginSessionId);
    } else {
      console.log("로그인 필요");
    }
    console.log("세션아이디", loginSessionId);
    console.log("포스트아이디", postId);
  }, [loginSessionId]);

  // 좋아요 상태 받아오기
  const fetchLikeStatus = async (userId: string) => {
    // 내 좋아요 상태 가져오기
    const { data: likeStatusData, error: likeStatusError } = await supabase
      .from("LIKE_TABLE")
      .select("like_id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .limit(1)
      .single();

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

    // 좋아요 총 개수 가져오기
    const { data, error } = await supabase.from("TEST2_TABLE").select("like_count").eq("post_id", postId).single();

    if (error) {
      console.error("좋아요 개수 가져오기 오류:", error.message);
    } else {
      setLikeCount(data?.like_count || 0);
    }
  };

  const handleToggleLikeButton = async () => {
    if (!loginSessionId) {
      alert("로그인 해주세요.");
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

  return (
    <button onClick={handleToggleLikeButton}>
      {isLike ? "💛" : "🤍"} 좋아요 {likeCount} 개
    </button>
  );
};

export default LikeButton;
