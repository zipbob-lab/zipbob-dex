
import { createClient } from "@/supabase/client";
import { supabase } from "@/supabase/supabase";


interface FetchCommentInfoProps {
  startRange:number;
  endRange:number;
  postId:string  ;  
  }

interface DeleteCommentProps {
    postId:string  
    commentId:string;
    totalComments:number;
    setTotalComments: (count: number) => void;    
}


export const FetchCommentInfo = async ({postId, startRange,endRange}:FetchCommentInfoProps)=>{
    const supabase = createClient(); 
    const {
        data: commentData,
        error: commentError,
        count
    } = await supabase
        .from("COMMENT_TABLE")
        .select(`*, USER_TABLE(user_id,user_nickname, user_introduce,user_img,user_rank)`, { count: "exact" })
        .eq("post_id", postId)
        .eq("comment_active", true)
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

    if (commentError) {
      throw new Error(commentError.message); 
    } 
    return { commentData: commentData || [], totalComments: count || 0 };
}

export const DeleteComment = async ({postId,commentId,totalComments, setTotalComments}:DeleteCommentProps) =>{
    const { error: deleteError } = await supabase
    .from("COMMENT_TABLE")
    .update({ comment_active: false })
    .eq("comment_id", commentId);

  if (deleteError) {
    console.error(deleteError.message);
    alert("댓글 삭제 실패");
    return;
  }

  alert("댓글 삭제 성공!");

  const { error: countError } = await supabase
    .from("MY_RECIPE_TABLE")
    .update({ comment_count: totalComments - 1 })
    .eq("post_id", postId);

  if (countError) {
    console.error("카운트 업데이트 에러", countError.message);
  } else {
    setTotalComments(totalComments - 1);
  }
}
