// MyPageProfile.tsx
"use client";
import Link from "next/link";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { useEffect, useState } from "react";
import { updateUserRank } from "@/utils/updateUserRank";
import EditProfileModal from "./EditProfileModal";
import { Pencil } from "lucide-react";
import { supabase } from "@/supabase/supabase";

interface UserProfile {
  user_id: string;
  user_nickname: string;
  user_img: string;
  user_email: string;
  user_exp: number;
  user_rank: number;
  user_introduce: string;
}

const levelEmojis: { [key: number]: string } = {
  0: "🌱",
  1: "🪺",
  2: "🥚",
  3: "🐣",
  4: "🐥",
  5: "🐓"
};

const MyPageProfile = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      const profileData = await fetchUserProfile();
      if (profileData) {
        await updateUserRank(profileData.user_id);
        const updatedProfileData = await fetchUserProfile();
        setUserData(updatedProfileData);
      }
      setLoading(false);
    };
    loadUserProfile();
  }, []);

  const handleImageUpload = (newImageUrl: string) => {
    setUserData((prev) => (prev ? { ...prev, user_img: `${newImageUrl}?timestamp=${new Date().getTime()}` } : null));
  };

  const handleIntroduceSave = async (introduce: string) => {
    if (!userData) return;

    const { error } = await supabase
      .from("USER_TABLE")
      .update({ user_introduce: introduce })
      .eq("user_id", userData.user_id);

    if (error) {
      console.error("자기소개 업데이트 오류:", error.message);
      return;
    }

    setUserData((prev) => (prev ? { ...prev, user_introduce: introduce } : null));
  };

  if (loading) return <p>Loading...</p>;

  const levelEmoji: string = userData ? levelEmojis[userData.user_rank] : "🧑🏻‍🍳";
  const progressPercent = userData ? userData.user_exp % 100 : 0;

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 w-[300px] p-5">
      {userData ? (
        <>
          <div className="w-full h-full rounded-full overflow-hidden mb-4">
            <img src={userData.user_img} alt={userData.user_nickname} className="object-fill" />
          </div>

          <div className="flex justify-center items-center">
            <p>{levelEmoji}</p>
            <h3 className="my-2">{userData.user_nickname}</h3>
            {/* 수정 버튼 */}
            <button onClick={() => setIsModalOpen(true)} className=" flex items-center">
              <Pencil size={16} className="ml-1" />
            </button>
          </div>

          {/* 프로그레스 바 */}
          <div className="w-full bg-orange-300 rounded-full h-2 mt-2">
            <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-sm mt-1">{progressPercent}/100 경험치</p>
          <p className="text-sm mt-2">{userData.user_introduce}</p>

          <Link href="/myrecipewrite" className="mt-3 p-3 rounded-sm bg-orange-500 text-white">
            나만의 레시피 올리기
          </Link>

          {/* 프로필 수정 모달 */}
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userData={userData}
            onImageUpload={handleImageUpload}
            onIntroduceSave={handleIntroduceSave}
          />
        </>
      ) : (
        <p>프로필 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default MyPageProfile;
