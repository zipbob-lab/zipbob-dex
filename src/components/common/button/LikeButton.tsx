"use client";
import { useLikeStore } from "@/store/likeStore";
import { supabase } from "@/supabase/supabase";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface LikeButton {
  postId: string;
  userId: string;
}

const Likebutton = ({ postId, userId }: LikeButton) => {
  const { isLike, likeCount, setLikeCount, toggleLike } = useLikeStore();

  useEffect(() => {
    const fetchLikeCountAll = async () => {
      const { data, error } = await supabase
        .from("TEST2_TABLE")
        .select("like_count")
        .eq("post_id", "69376e49-365c-4a86-b99f-6f32d4607d29")
        .single();

      if (error) {
        console.error("좋아요 가져오기 오류", error.message);
      } else {
        setLikeCount(data.like_count); // 초반 좋아요 갯수
      }
    };
    fetchLikeCountAll();
  }, [setLikeCount]);

  const handleToggleLikeButton = async () => {
    if (!userId) {
      alert("로그인 해주세요.");
      return;
    }
    // 좋아요 취소
    if (isLike) {
      await supabase
        .from("TEST2_TABLE")
        .update({ like_count: likeCount - 1 })
        .eq("post_id", "69376e49-365c-4a86-b99f-6f32d4607d29");

      await supabase
        .from("LIKE_TABLE")
        .delete()
        .match({ post_id: "69376e49-365c-4a86-b99f-6f32d4607d29", user_id: userId });
    } else {
      await supabase
        .from("TEST2_TABLE")
        .update({ like_count: likeCount + 1 })
        .eq("post_id", "69376e49-365c-4a86-b99f-6f32d4607d29");

      await supabase
        .from("LIKE_TABLE")
        .insert({ post_id: "69376e49-365c-4a86-b99f-6f32d4607d29", user_id: userId, like_id: uuidv4() });
    }

    toggleLike();
  };

  return (
    <div>
      <button onClick={handleToggleLikeButton}>
        {isLike ? "💛" : "🤍"} 좋아요 {likeCount} 개
      </button>
    </div>
  );
};

export default Likebutton;
