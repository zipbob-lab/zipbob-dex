"use client";
import Link from "next/link";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { useEffect, useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
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

const MyPageProfile = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedIntroduce, setEditedIntroduce] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      const profileData = await fetchUserProfile();
      if (profileData) {
        setUserData(profileData);
        setEditedIntroduce(profileData.user_introduce);
      }
      setLoading(false);
    };
    loadUserProfile();
  }, []);

  const handleImageUpload = (newImageUrl: string) => {
    setUserData((prev) => (prev ? { ...prev, user_img: `${newImageUrl}?timestamp=${new Date().getTime()}` } : null));
  };

  const handleIntroduceSave = async () => {
    if (!userData) return;

    const { error } = await supabase
      .from("USER_TABLE")
      .update({ user_introduce: editedIntroduce })
      .eq("user_id", userData.user_id);

    if (error) {
      console.error("자기소개 업데이트 오류:", error.message);
      return;
    }

    setUserData((prev) => (prev ? { ...prev, user_introduce: editedIntroduce } : null));
    setIsEditing(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-center items-center bg-gray-200 w-[300px] p-5">
      {userData ? (
        <>
          <div className="w-full h-full rounded-full overflow-hidden mb-4">
            <img src={userData.user_img} alt={userData.user_nickname} className="object-fill" />
          </div>

          <div className="flex justify-center items-center">
            <p>Lv.{userData.user_exp}</p>
            <h3 className="my-2">{userData.user_nickname}</h3>
          </div>

          {/* 이미지 업로드 */}
          <ProfileImageUpload userId={userData.user_id} onImageUpload={handleImageUpload} />

          {/* 자기소개 */}
          <div className="text-sm mt-4">
            {isEditing ? (
              <>
                <textarea
                  value={editedIntroduce}
                  onChange={(e) => setEditedIntroduce(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="mt-2">
                  <button onClick={handleIntroduceSave} className="p-2 bg-green-500 text-white rounded mr-2">
                    저장
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-400 text-white rounded">
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{userData.user_introduce}</p>
                <button onClick={() => setIsEditing(true)} className="mt-2 p-2 bg-blue-500 text-white rounded">
                  자기소개 수정
                </button>
              </>
            )}
          </div>

          <Link href="/myrecipewirte" className="mt-3 p-3 rounded-sm bg-orange-500 text-white">
            나만의 레시피 올리기
          </Link>
        </>
      ) : (
        <p>프로필 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default MyPageProfile;
