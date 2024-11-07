import Image from "next/image";
import { useState } from "react";
import MoreVerticalIcon from "@images/moreVertical.svg";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface CommentDropBoxProps {
  commentId: string;
  sessionId: string | null;
  commentUserId: string;
  handleCommentModify: () => void;
  handleCommentDelete: () => void;
}

const CommentDropBox = ({
  commentId,
  sessionId,
  commentUserId,
  handleCommentModify,
  handleCommentDelete
}: CommentDropBoxProps) => {
  const [dropDownId, setDropDownId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDropDown = () => {
    setDropDownId((prev) => (prev === commentId ? null : commentId));
  };

  const closeDropDownAndModal = () => {
    setDropDownId(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative ml-auto">
      {commentUserId === sessionId && (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={handleDropDown} className="relative">
            <Image src={MoreVerticalIcon} alt="더보기 버튼" width={24} height={24} />
          </button>
          {dropDownId === commentId && (
            <div className="absolute top-8 flex h-[88px] w-[104px] flex-col gap-y-2 rounded-2xl border border-Gray-100 bg-white p-2">
              <button
                type="button"
                className="h-8 w-full items-center justify-center rounded-2xl p-2 text-[#21272A] hover:bg-Secondary-50"
                onClick={() => {
                  handleCommentModify();
                  closeDropDownAndModal();
                }}
              >
                수정
              </button>
              <button
                type="button"
                className="h-8 w-full items-center justify-center rounded-2xl p-2 text-[#21272A] hover:bg-Secondary-50"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                삭제
              </button>

              {/* 삭제 확인 */}
              <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                handleClose={closeDropDownAndModal}
                handleDelete={() => {
                  handleCommentDelete();
                  closeDropDownAndModal();
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentDropBox;
