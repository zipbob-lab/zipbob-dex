"use client";
import { createClient } from "@/supabase/client";
import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { CommentExp } from "./CommentExp";

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

interface PostDataProps {
  postId: string;
}

const Comments = ({ postId }: PostDataProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  // 댓글 수정 관련
  const [modifyCommentId, setModifyCommentId] = useState<string | null>(null);
  const [dropDownId, setDropDownId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  // 페이지 네이션
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [totalComments, setTotalComments] = useState<number>(0); // 전체 댓글 수
  // const [commentCount, setCommentCount] = useState<number>(0);
  const commentsPerPage = 10; // 페이지 당 댓글 수

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
      .eq("post_id", postId)
      .eq("comment_active", true)
      .order("created_at", { ascending: false })
      .range(startRange, endRange);

    if (commnetError) {
      console.error("코멘트 데이터 불러오기 실패  ", commnetError.message);
    } else {
      setComments(commentData || []);
      setTotalComments(count || 0); // 페이지 네이션
    }
  };

  // 댓글 더보기
  const handleDropDown = (commentId: string) => {
    console.log(`드롭다운 ${commentId}`);
    setDropDownId((prev) => (prev === commentId ? null : commentId));
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
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
      .from("TEST2_TABLE")
      .update({ comment_count: totalComments - 1 })
      .eq("post_id", postId);

    if (countError) {
      console.error("카운트 업데이트 에러", countError.message);
    } else {
      setTotalComments((prev) => prev - 1);
    }
    FetchCommentInfo();
  };

  // 댓글 제출 핸들러
  const onSubmit: SubmitHandler<CommentFormInput> = async (data) => {
    const supabase = createClient();

    await CommentExp({ userId: sessionId, postId });
    // supabase에 코멘트 INSERT
    const { error } = await supabase.from("COMMENT_TABLE").insert({
      user_id: sessionId,
      post_id: postId,
      comment_id: uuidv4(),
      comment: data.commentText,
      comment_active: true
    });

    if (error) {
      console.error("댓글 INSERT 에러 : ", error.message);
      alert("댓글 등록 실패");
      return error;
    } else {
      const { error: countError } = await supabase
        .from("TEST2_TABLE")
        .update({ comment_count: totalComments + 1 })
        .eq("post_id", postId);
      if (countError) {
        console.error("업데이트 에러", countError.message);
      } else {
        setTotalComments((prev) => prev + 1);
      }

      setCurrentPage(1);
      FetchCommentInfo();
      alert("댓글 등록 완료!");
      reset({ commentText: "" });
    }
  };

  // 댓글 수정 버튼 눌렀을 때
  const handleMotifyCommentDoing = async (commentId: string, modifyText: string) => {
    setModifyCommentId(commentId);
    modifyReset({ modifyCommentText: modifyText });
    setDropDownId(null);
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

  // 페이지 수 계산
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  // 페이지 번호 변경
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5 bg-[#FBFBFB] p-5">
      {/* 댓글 제목 */}
      <div className="flex flex-row gap-3 p-5">
        <h1 className="flex items-end justify-center text-2xl font-bold">집밥 탐험일지</h1>
        <span className="flex items-end justify-center">{totalComments} 개</span>
      </div>
      {/* 댓글 작성창 */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-500 bg-white p-5">
        <div className="flex flex-col gap-2 border-solid border-b-gray-800">
          <textarea
            className="h-20 w-full resize-none"
            placeholder={`레시피에 대해 자유롭게 의견을 남겨봐요!\n나만의 댓글을 남기면 경험치를 받을 수 있어요.`}
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
            className="w-14 items-center justify-center rounded-xl bg-orange-200 p-1 text-sm text-white"
          >
            입력
          </button>
        </div>
      </div>
      {comments.map((comment) => (
        <div key={comment.comment_id} className="flex flex-col border-b border-gray-200">
          {/* 댓글 목록 */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row">
              <div className="flex gap-1">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-500">
                  <Image
                    src={comment.USER_TABLE.user_img}
                    alt="프로필 이미지"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {/* 유저 정보 */}
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex gap-2">
                    <span className="mt-1 font-bold">Lv.{comment.USER_TABLE.user_rank}</span>
                    <span className="mt-1 font-bold">{comment.USER_TABLE.user_nickname}</span>
                    {comment.user_id === sessionId && (
                      <span className="rounded-lg bg-yellow-300 p-1">내가 작성한 댓글이에욤.</span>
                    )}
                  </div>
                  <span className="text-gray-300">{comment.USER_TABLE.user_introduce || "유저 소개가 없습니다."}</span>
                </div>
              </div>

              <div className="ml-auto">
                {comment.user_id === sessionId && (
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => handleDropDown(comment.comment_id)} className="relative">
                      더보기
                    </button>
                    {dropDownId === comment.comment_id && (
                      <div className="absolute mt-2 flex w-20 flex-col justify-items-center gap-2 rounded-md border bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          className="w-14 items-center justify-center rounded-xl bg-orange-400 p-1 text-sm text-white"
                          onClick={() => {
                            handleMotifyCommentDoing(comment.comment_id, comment.comment);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="w-14 items-center justify-center rounded-xl bg-orange-400 p-1 text-sm text-white"
                          onClick={() => setIsDeleteModalOpen(true)}
                        >
                          삭제
                        </button>
                        {isDeleteModalOpen && (
                          <div className="fixed inset-0 items-center justify-center bg-black bg-opacity-45">
                            <div className="rounded-lg bg-white p-5">
                              <div className="flex flex-col items-center justify-center">
                                <h1 className="text-lg font-bold">댓글을 정말로 삭제하시겠어요?</h1>
                                <div className="flex flex-row gap-3">
                                  <button
                                    className="rounded-lg bg-orange-400 p-2 text-white"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                  >
                                    취소하기
                                  </button>
                                  <button
                                    className="rounded-lg bg-orange-400 p-2 text-white"
                                    onClick={() => handleDeleteComment(comment.comment_id)}
                                  >
                                    삭제하기
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 수정 눌렀을 때 댓글 폼 표시*/}
            {modifyCommentId === comment.comment_id ? (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-500 bg-white p-5">
                <div className="flex flex-col gap-2 border-solid border-b-gray-800">
                  <textarea
                    className="h-20 w-full resize-none"
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
                    className="w-14 items-center justify-center rounded-xl bg-orange-400 p-1 text-sm text-white"
                    onClick={modifyHandleSubmit(onSubmitModify)}
                  >
                    수정 완료
                  </button>
                </div>
              </div>
            ) : (
              <span className="mb-5">{comment.comment}</span>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className="text-lg transition-colors duration-300 hover:text-orange-500"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </form>
  );
};

export default Comments;
