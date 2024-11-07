"use client";

import Link from "next/link";
import { supabase } from "@/supabase/supabase";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { uploadProfileImage } from "@/utils/uploadProfileImage";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Pencil from "@images/pen.svg";
import PencilWhite from "@images/penWhite.svg";

import Image from "next/image";
import DefaultImage from "@images/default-profile.svg";
import UserLevelEmoji from "./level/UserLevelEmoji";
import UserRank from "./level/UserLevel";

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
  const [userRank, setUserRank] = useState(0);
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

  const handleRankChange = (rank: number) => {
    setUserRank(rank); // userRank 상태 업데이트
  };

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
    <div className="flex h-[560px] w-[360px] flex-col items-center justify-center rounded-2xl bg-[#FFF6DC] px-16 py-10">
      {userData ? (
        <>
          <div className="mb-4 h-36 w-36 overflow-hidden rounded-full">
            <Image
              src={userData.user_img || DefaultImage}
              alt={userData.user_nickname}
              width={160}
              height={160}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2">
              {/* UserLevelEmoji 컴포넌트 */}
              <UserLevelEmoji userRank={userRank} />
              <h3 className="text-xl font-semibold">{userData.user_nickname}</h3>
              <button onClick={() => setIsModalOpen(true)} className="text-gray-500 hover:text-gray-700">
                <Image src={Pencil} width={24} height={24} alt="연필 아이콘" />
              </button>
            </div>
          </div>
          {/* UserRank 컴포넌트 */}
          <UserRank userId={userData.user_id} onRankChange={handleRankChange} />
          <p className="mb-4 text-sm">{userData.user_introduce}</p>

          <div className="text-md mx-3 my-4 flex w-48 items-center justify-center rounded-2xl bg-Primary-300 p-3 text-white">
            <Link href="/myrecipewrite" className="flex items-center gap-2">
              <Image src={PencilWhite} width={20} height={20} alt="연필 아이콘" className="inline-block" />
              <span className="inline-block">나만의 레시피 올리기</span>
            </Link>
          </div>

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
