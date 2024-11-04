"use client";

import Link from "next/link";
import { supabase } from "@/supabase/supabase";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { uploadProfileImage } from "@/utils/uploadProfileImage";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Pencil from "../../../public/images/pen.svg";
import UserRank from "../UserRank";
import Image from "next/image";
import DefaultImage from "../../../public/images/default-profile.svg";

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
    <div className="flex flex-col justify-evenly items-center bg-gray-100 w-[364px] h-[560px] p-5 rounded-lg shadow-lg">
      {userData ? (
        <>
          <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-2 border-gray-300 shadow-sm">
            <Image
              src={userData.user_img || DefaultImage}
              alt={userData.user_nickname}
              width={160}
              height={160}
              className="object-cover object-center w-full h-full"
            />
          </div>

          <div className="flex flex-col justify-center items-center text-center">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold mb-2">{userData.user_nickname}</h3>
              <button onClick={() => setIsModalOpen(true)} className="ml-1 text-gray-500 hover:text-gray-700">
                <Image src={Pencil} width={24} height={24} alt="연필 아이콘" />
              </button>
            </div>
            <p className="text-sm mt-2">{userData.user_introduce}</p>
          </div>

          {/* UserRank 컴포넌트 */}
          <UserRank userId={userData.user_id} />

          <Link
            href="/myrecipewrite"
            className="mt-5 p-3 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
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
