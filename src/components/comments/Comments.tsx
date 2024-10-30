"use client";
import { createClient } from "@/supabase/client";
import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface CommentFormInput {
  commentText: string;
}

interface ModifyCommentFormInput {
  modifyCommentText: string;
}

interface UserInfo {
  user_nickname: string;
  user_introduce: string;
  user_img: string;
  user_rank: number;
}

interface CommentData {
  comment_id: string;
  comment: string;
  user_id: string;
  USER_TABLE: UserInfo;
}

const Comments = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  // 댓글 수정 관련
  const [modifyCommentId, setModifyCommentId] = useState<string | null>(null);
  // 페이지 네이션
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const commentsPerPage = 10; // 페이지 당 댓글 수
  const [totalComments, setTotalComments] = useState(0); // 전체 댓글 수

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<CommentFormInput>({ mode: "onChange", defaultValues: { commentText: "" } });

  const {
    register: modifyRegister,
    handleSubmit: modifyHandleSubmit,
    watch: modifyWatch,
    reset: modifyReset,
    formState: { errors: modifyErrors }
  } = useForm<ModifyCommentFormInput>({ mode: "onChange", defaultValues: { modifyCommentText: "" } });

  const commentMaxLength = 250;
  const commentCurrentLength = watch("commentText")?.length;
  const modifyCommentCurrentLength = modifyWatch("modifyCommentText")?.length;

  useEffect(() => {
    FetchCommentInfo();
  }, []);

  const FetchCommentInfo = async () => {
    const supabase = createClient();

    // 페이지 네이션
    const startRange = (currentPage - 1) * commentsPerPage;
    const endRange = startRange + commentsPerPage - 1;

    // 로그인 세션
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error(sessionError.message);
      return sessionError;
    }
    const loginSessionId = session?.user?.id;
    setSessionId(loginSessionId || null);

    // 코멘트 정보 가져오기
    const {
      data: commentData,
      error: commnetError,
      count
    } = await supabase
      .from("COMMENT_TABLE")
      .select(`*, USER_TABLE(user_id,user_nickname, user_introduce,user_img,user_rank)`, { count: "exact" })
      .eq("post_id", "69376e49-365c-4a86-b99f-6f32d4607d29")
      .order("created_at", { ascending: false })
      .range(startRange, endRange);

    if (commnetError) {
      console.error("코멘트 데이터 불러오기 실패  ", commnetError.message);
    } else {
      setComments(commentData || []);
      setTotalComments(count || 0); // 페이지 네이션
      console.log("코멘트 데이터 불러오기 성공", commentData);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    const { error: deleteError } = await supabase.from("COMMENT_TABLE").delete().eq("comment_id", commentId);
    if (deleteError) {
      console.error(deleteError.message);
      alert("댓글 삭제 실패");
      return;
    }

    alert("댓글 삭제 성공!");
    FetchCommentInfo();
  };

  // 댓글 제출 핸들러
  const onSubmit: SubmitHandler<CommentFormInput> = async (data) => {
    const supabase = createClient();
    // supabase에 코멘트 INSERT
    const { error } = await supabase.from("COMMENT_TABLE").insert({
      user_id: sessionId,
      post_id: "69376e49-365c-4a86-b99f-6f32d4607d29",
      comment_id: uuidv4(),
      comment: data.commentText
    });

    if (error) {
      console.error("댓글 INSERT 에러 : ", error.message);
      alert("댓글 등록 실패");
      return error;
    } else {
      console.log("댓글 INSERT 성공 : ", data);
      FetchCommentInfo();
      alert("댓글 등록 완료!");
      reset({ commentText: "" });
    }
  };

  // 댓글 수정 버튼 눌렀을 때
  const handleMotifyCommentDoing = async (commentId: string, modifyText: string) => {
    setModifyCommentId(commentId);
    modifyReset({ modifyCommentText: modifyText });
  };

  // 댓글 수정 제출 핸들러
  const onSubmitModify: SubmitHandler<ModifyCommentFormInput> = async (data) => {
    // const modifyCommentText = watch("modifyCommentText") || "";

    if (!modifyCommentId) return;

    const { error: modifyError } = await supabase
      .from("COMMENT_TABLE")
      .update({ comment: data.modifyCommentText })
      .eq("comment_id", modifyCommentId);

    if (modifyError) {
      alert("댓글 수정 실패");
      return;
    }

    alert("댓글 수정 성공!");
    setModifyCommentId(null);
    FetchCommentInfo();
  };

  useEffect(() => {
    FetchCommentInfo();
  }, [currentPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  // 페이지 번호 변경 함수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white p-5 flex flex-col gap-5">
      {/* 댓글 제목 */}
      <div className="p-5 flex flex-row gap-3">
        <h1 className="flex items-end justify-center text-2xl font-bold">요리 후기</h1>
        <span className="flex items-end justify-center">{comments.length} 개</span>
      </div>
      {/* 댓글 작성창 */}
      <div className="bg-white p-5 rounded-xl flex flex-col gap-4 border  border-gray-500">
        <div className="border-b-gray-800 border-solid flex flex-col gap-2">
          <textarea
            className="resize-none w-full h-20"
            placeholder="후기를 통해 요리를 인증하면 경험치를 받을 수 있어요."
            {...register(`commentText`, {
              maxLength: {
                value: commentMaxLength,
                message: `${commentMaxLength}자 이상 작성할 수 없습니다.`
              },
              required: {
                value: true,
                message: "후기를 입력해주세요."
              }
            })}
          />
          {errors?.commentText?.message ? <span>{errors?.commentText?.message}</span> : false}
        </div>
        <div className="flex flex-row justify-between text-gray-300">
          <span>
            {commentCurrentLength}/{commentMaxLength}
          </span>
          <button
            type="submit"
            className="p-1 rounded-xl
           justify-center items-center text-sm text-white w-14 bg-orange-400"
          >
            입력
          </button>
        </div>
      </div>
      {comments.map((comment) => (
        <div key={comment.comment_id} className="flex flex-col border-b border-gray-200">
          {/* 댓글 목록 */}
          <div className="flex flex-col gap-3 p-1">
            <div className="flex gap-1">
              <div className="flex justify-center items-center w-12 h-12 rounded-full bg-gray-500 relative overflow-hidden">
                <Image
                  src={comment.USER_TABLE.user_img}
                  alt="완성 이미지"
                  fill={true}
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* 유저 정보 */}
              <div className="flex flex-col gap-2 justify-center">
                <div className="flex gap-2">
                  <span className="font-bold mt-1">Lv.{comment.USER_TABLE.user_rank}</span>
                  <span className="font-bold mt-1">{comment.USER_TABLE.user_nickname}</span>
                  {comment.user_id === sessionId && (
                    <span className="bg-yellow-300 p-1 rounded-lg">내가 작성한 댓글이에욤.</span>
                  )}
                </div>
                <span className="text-gray-300">{comment.USER_TABLE.user_introduce || "유저 소개가 없습니다."}</span>
              </div>
            </div>

            {/* 수정 눌렀을 때 댓글 폼 표시*/}
            {modifyCommentId === comment.comment_id ? (
              <div className="bg-white p-5 rounded-xl flex flex-col gap-4 border border-gray-500">
                <div className="border-b-gray-800 border-solid flex flex-col gap-2">
                  <textarea
                    className="resize-none w-full h-20"
                    placeholder="후기를 통해 요리를 인증하면 경험치를 받을 수 있어요."
                    {...modifyRegister(`modifyCommentText`, {
                      maxLength: {
                        value: commentMaxLength,
                        message: `${commentMaxLength}자 이상 작성할 수 없습니다.`
                      },
                      required: {
                        value: true,
                        message: "후기를 입력해주세요."
                      }
                    })}
                  />
                  {modifyErrors?.modifyCommentText?.message && <span>{modifyErrors.modifyCommentText.message}</span>}
                </div>
                <div className="flex flex-row justify-between text-gray-300">
                  <span>
                    {modifyCommentCurrentLength}/{commentMaxLength}
                  </span>
                  <button
                    type="button"
                    className="p-1 rounded-xl justify-center items-center text-sm text-white w-14 bg-orange-400"
                    onClick={modifyHandleSubmit(onSubmitModify)}
                  >
                    수정 완료
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="mb-5">{comment.comment}</span>
                {comment.user_id === sessionId && (
                  <div className="flex gap-1 justify-end">
                    <button
                      type="button"
                      className="p-1 rounded-xl justify-center items-center text-sm text-white w-14 bg-orange-400"
                      onClick={() => {
                        handleMotifyCommentDoing(comment.comment_id, comment.comment);
                      }}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="p-1 rounded-xl justify-center items-center text-sm text-white w-14 bg-orange-400"
                      onClick={() => handleDeleteComment(comment.comment_id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </form>
  );
};

export default Comments;
