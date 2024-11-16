"use client";

import Link from "next/link";
import { supabase } from "@/supabase/supabase";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { uploadProfileImage } from "@/utils/uploadProfileImage";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Pencil from "@images/pen.svg";

import Image from "next/image";
import DefaultImage from "@images/default-profile.svg";
import UserLevelEmoji from "./level/UserLevelEmoji";
import UserRank from "./level/UserLevel";
import UserLevelOverview from "./level/UserLevelOverview";
import LoadingSpinner from "../common/LoadingSpinner";

interface UserProfile {
  user_id: string;
  user_nickname: string;
  user_img: string;
  user_email: string;
  user_introduce: string;
  user_rank: number;
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

  if (loading)
    return (
      <div className="w-full">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-[#FFF6DC] p-12 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
        {userData ? (
          <>
            <div className="h-28 w-28 overflow-hidden rounded-full">
              <Image
                src={userData.user_img || DefaultImage}
                alt={userData.user_nickname}
                width={112}
                height={112}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="flex items-center justify-center ssm:gap-[0.12rem] md:gap-2">
              {/* UserLevelEmoji 컴포넌트 */}
              <UserLevelEmoji userRank={userRank} />
              <h3 className="ssm:text-title-18 md:text-heading-20">{userData.user_nickname}</h3>
              <button onClick={() => setIsModalOpen(true)}>
                <Image src={Pencil} width={20} height={20} alt="연필 아이콘" />
              </button>
            </div>

            {/* UserRank 컴포넌트 */}
            <UserRank userId={userData.user_id} onRankChange={handleRankChange} />
            <p className="max-w-[14.3rem] text-Gray-700 ssm:text-body-12 md:text-body-14">{userData.user_introduce}</p>
            <Link href="/myrecipewrite" className="flex items-center gap-2">
              <div className="rounded-2xl bg-Primary-300 text-center text-body-16 text-white ssm:min-w-[14.25rem] ssm:px-3 ssm:py-4">
                나만의 레시피 올리기
              </div>
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
      <div className="mt-7 rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
        <span className="inline-block rounded-full border-[1px] border-Primary-300 px-5 py-1 text-body-14 text-Primary-300">
          Level{" "}
          <span className="ml-1">
            {userData && typeof userData.user_rank === "number" ? userData.user_rank + 1 : ""}
          </span>
        </span>

        {userData && <UserLevelOverview userId={userData?.user_id} />}
      </div>
    </div>
  );
};

export default MyPageProfile;
