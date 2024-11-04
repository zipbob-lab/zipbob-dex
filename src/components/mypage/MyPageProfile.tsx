"use client";

import Link from "next/link";
import { supabase } from "@/supabase/supabase";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { uploadProfileImage } from "@/utils/uploadProfileImage";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Pencil from "@images/pen.svg";
import UserRank from "../UserRank";
import Image from "next/image";
import DefaultImage from "@images/default-profile.svg";

interface UserProfile {
  user_id: string;
  user_nickname: string;
  user_img: string;
  user_email: string;
  user_introduce: string;
}

const MyPageProfile = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      const profileData = await fetchUserProfile();
      if (profileData) {
        setUserData(profileData);
      }
      setLoading(false);
    };
    loadUserProfile();
  }, []);

  // 저장하기 버튼 -> 이미지, 자기소개 모두 저장
  const handleSave = async (nickname: string, introduce: string, file: File | null) => {
    if (!userData) return;

    // 자기소개 업데이트
    const { error: introError } = await supabase
      .from("USER_TABLE")
      .update({ user_nickname: nickname, user_introduce: introduce })
      .eq("user_id", userData.user_id);

    if (introError) {
      console.error("자기소개 업데이트 오류:", introError.message);
      return;
    }

    // 이미지 업로드 처리
    if (file) {
      const profileImageUrl = await uploadProfileImage(userData.user_id, file);

      if (profileImageUrl) {
        const { error: imgUpdateError } = await supabase
          .from("USER_TABLE")
          .update({ user_img: profileImageUrl })
          .eq("user_id", userData.user_id);

        if (imgUpdateError) {
          console.error("USER_TABLE에 이미지 URL 업데이트 오류:", imgUpdateError.message);
          return;
        }

        // 상태 업데이트
        setUserData((prev) => (prev ? { ...prev, user_img: profileImageUrl } : null));
      }
    }

    // 새로운 자기소개 반영
    setUserData((prev) => (prev ? { ...prev, user_nickname: nickname, user_introduce: introduce } : null));
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    if (!userData) return;

    const { error } = await supabase
      .from("USER_TABLE")
      .update({ user_img: "", user_introduce: "" })
      .eq("user_id", userData.user_id);

    if (error) {
      console.error("데이터 초기화 오류:", error.message);
      return;
    }
    setUserData((prev) => (prev ? { ...prev, user_img: "", user_introduce: "" } : null));
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-[560px] w-[364px] flex-col items-center justify-evenly rounded-lg bg-gray-100 p-5 shadow-lg">
      {userData ? (
        <>
          <div className="mb-4 h-40 w-40 overflow-hidden rounded-full border-2 border-gray-300 shadow-sm">
            <Image
              src={userData.user_img || DefaultImage}
              alt={userData.user_nickname}
              width={160}
              height={160}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-2">
              <h3 className="mb-2 text-lg font-semibold">{userData.user_nickname}</h3>
              <button onClick={() => setIsModalOpen(true)} className="ml-1 text-gray-500 hover:text-gray-700">
                <Image src={Pencil} width={24} height={24} alt="연필 아이콘" />
              </button>
            </div>
            <p className="mt-2 text-sm">{userData.user_introduce}</p>
          </div>

          {/* UserRank 컴포넌트 */}
          <UserRank userId={userData.user_id} />

          <Link
            href="/myrecipewrite"
            className="mt-5 rounded-md bg-orange-500 p-3 text-white transition-colors duration-200 hover:bg-orange-600"
          >
            나만의 레시피 올리기
          </Link>

          {/* 프로필 수정 모달 */}
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userData={userData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <p>프로필 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default MyPageProfile;
