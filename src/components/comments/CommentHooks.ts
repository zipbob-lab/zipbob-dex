
import { createClient } from "@/supabase/client";
import { CommentData } from "./Comments";
import { supabase } from "@/supabase/supabase";


interface FetchCommentInfoProps {
    postId:string  
    currentPage:number;
    commentsPerPage:number;
    setComments: (comments: CommentData[]) => void; 
    setTotalComments: (count: number) => void;    
  }

interface DeleteCommentProps {
    postId:string  
    commentId:string;
    totalComments:number;
    setTotalComments: (count: number) => void;    
}


export const FetchCommentInfo = async ({postId, setComments,setTotalComments,currentPage,commentsPerPage}:FetchCommentInfoProps)=>{
    const supabase = createClient();
    // 페이지 네이션
    const startRange = (currentPage - 1) * commentsPerPage;
    const endRange = startRange + commentsPerPage - 1;
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
        console.error("코멘트 데이터 불러오기 실패  ", commentError.message);
    } else {
        setComments(commentData || []);
        setTotalComments(count || 0); // 페이지 네이션
    }
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
