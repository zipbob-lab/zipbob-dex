"use client";
import { createClient } from "@/supabase/client";
import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { CommentExp } from "./CommentExp";
import CommentGrayLine from "@images/comment/commentGrayLine.svg";
import CommentGrayLine2 from "@images/comment/commnetGrayLine2.svg";
import CommentDropBox from "./CommentDropBox";

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
  created_at: string;
}

interface PostDataProps {
  postId: string;
}

const Comments = ({ postId }: PostDataProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  // 댓글 수정 관련
  const [modifyCommentId, setModifyCommentId] = useState<string | null>(null);
  // const [dropDownId, setDropDownId] = useState<string | null>(null);
  // 페이지 네이션
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [totalComments, setTotalComments] = useState<number>(0); // 전체 댓글 수
  // const [commentCount, setCommentCount] = useState<number>(0);
  const commentsPerPage = 10; // 페이지 당 댓글 수
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isModiFocused, setIsModiFocused] = useState<boolean>(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

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

  // // 댓글 더보기
  // const handleDropDown = (commentId: string) => {
  //   console.log(`드롭다운 ${commentId}`);
  //   setDropDownId((prev) => (prev === commentId ? null : commentId));
  // };

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
      .from("MY_RECIPE_TABLE")
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
        .from("MY_RECIPE_TABLE")
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
    // setDropDownId(null);
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

    setIsFocused(false);
    setIsModiFocused(false);
  }, [currentPage]);

  // 페이지 수 계산
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  // 페이지 번호 변경
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-6 bg-[#FBFBFB]">
      {/* 댓글 제목 & 작성창 */}
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-2 p-3">
          <h1 className="flex items-end justify-center text-heading-28 text-Gray-900">집밥 탐험일지</h1>
          <span className="flex w-[71px] items-end justify-start text-body-18 text-[#787878]">{totalComments}개</span>
        </div>

        {/* 댓글 작성창 */}
        <div
          className={`flex flex-col rounded-2xl border-[1.5px] border-Gray-100 bg-white px-5 pb-3 pt-4 ${
            isFocused ? "border-Primary-300" : "border-Gray-100"
          }`}
        >
          <div className="flex flex-col border-solid border-b-gray-800">
            <textarea
              className={`h-20 w-full resize-none text-body-16 text-Gray-900 placeholder-Gray-500 focus:outline-none ${
                !sessionId ? "bg-white" : ""
              }`}
              disabled={!sessionId}
              placeholder={
                sessionId
                  ? `레시피에 대해 자유롭게 의견을 남겨봐요!\n나만의 댓글을 남기면 경험치를 받을 수 있어요.`
                  : `댓글을 작성하려면 로그인 해야해요.`
              }
              {...register(`commentText`, {
                maxLength: {
                  value: commentMaxLength,
                  message: `${commentMaxLength}자 이상 작성할 수 없습니다.`
                },
                required: {
                  value: true,
                  message: "후기를 입력해주세요."
                },
                onBlur: () => setIsFocused(false)
              })}
              onFocus={() => setIsFocused(true)}
            />
            <div className="mb-3 mt-2">
              <Image src={CommentGrayLine} alt="회색 라인" />
            </div>
            {/* {errors?.commentText?.message ? <span>{errors?.commentText?.message}</span> : null} */}
          </div>
          <div className="flex flex-row items-center justify-between">
            <span className="text-body-14 text-Gray-500">
              {commentCurrentLength}/{commentMaxLength}
            </span>
            <button
              type="submit"
              className="w-18 flex h-8 items-center justify-center rounded-[20px] bg-Primary-300 px-5 py-2 text-title-18 text-white"
            >
              입력
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-y-1">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="flex flex-col">
            {/* 댓글 항목 */}
            <div className="flex gap-x-3 p-4">
              <div>
                {/* 프로필 이미지 */}
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-500">
                  <Image
                    src={comment.USER_TABLE.user_img}
                    alt="프로필 이미지"
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col gap-y-3">
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between">
                    <div className="flex items-center justify-center">
                      <span className="mr-2">Lv.{comment.USER_TABLE.user_rank}</span>
                      <span className="mr-3 text-title-16 text-Gray-900">{comment.USER_TABLE.user_nickname}</span>
                      {comment.user_id === sessionId && (
                        <div className="flex items-center justify-center rounded-[10px] border border-Primary-300 px-3 py-0.5 text-body-14 text-Primary-300">
                          내가 작성한 댓글
                        </div>
                      )}
                    </div>
                    <div>
                      <CommentDropBox
                        commentId={comment.comment_id}
                        sessionId={sessionId}
                        commentUserId={comment.user_id}
                        handleCommentModify={() => handleMotifyCommentDoing(comment.comment_id, comment.comment)}
                        handleCommentDelete={() => handleDeleteComment(comment.comment_id)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {/* 수정 눌렀을 때 댓글 폼 표시 */}
                  {modifyCommentId === comment.comment_id ? (
                    <div
                      className={`flex flex-col rounded-2xl border-[1.5px] border-Gray-100 bg-white px-5 pb-3 pt-4 ${
                        isModiFocused ? "border-Primary-300" : "border-Gray-100"
                      }`}
                    >
                      <div className="flex flex-col border-solid border-b-gray-800">
                        <textarea
                          className="h-20 w-full resize-none text-body-16 text-gray-500 placeholder-gray-500 focus:outline-none"
                          placeholder="후기를 통해 요리를 인증하면 경험치를 받을 수 있어요."
                          {...modifyRegister(`modifyCommentText`, {
                            maxLength: {
                              value: commentMaxLength,
                              message: `${commentMaxLength}자 이상 작성할 수 없습니다.`
                            },
                            required: {
                              value: true,
                              message: "후기를 입력해주세요."
                            },
                            onBlur: () => setIsModiFocused(false)
                          })}
                          onFocus={() => setIsModiFocused(true)}
                        />
                        <div className="mb-3 mt-2">
                          <Image src={CommentGrayLine} alt="회색 라인" />
                        </div>
                        {modifyErrors?.modifyCommentText?.message && (
                          <span>{modifyErrors.modifyCommentText.message}</span>
                        )}
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <span className="text-body-14 text-Gray-500">
                          {modifyCommentCurrentLength}/{commentMaxLength}
                        </span>
                        <button
                          type="button"
                          className="w-18 flex h-8 items-center justify-center rounded-[20px] bg-Primary-300 px-5 py-2 text-title-18 text-white"
                          onClick={modifyHandleSubmit(onSubmitModify)}
                        >
                          입력
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-r-body-16 text-Gray-900">{comment.comment}</span>
                  )}
                </div>
                <div className="text-r-body-13 text-Gray-500">{formatDate(comment.created_at)}</div>
              </div>
            </div>
            <div>
              <Image src={CommentGrayLine2} alt="회색 라인2" />
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 네이션 */}
      <div className="flex items-center justify-center gap-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className="text-caption-14 text-Gray-900 hover:text-Secondary-200"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </form>
  );
};
export default Comments;
