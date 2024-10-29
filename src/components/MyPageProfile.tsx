"use client";
import Link from "next/link";
import { fetchUserProfile } from "@/serverActions/profileAction";
import { useEffect, useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";

interface UserProfile {
  user_id: string;
  user_nickname: string;
  user_img: string;
  user_email: string;
  user_exp: number;
  user_rank: number;
}

const MyPageProfile = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const profileData = await fetchUserProfile();

      if (profileData) {
        console.log("로드된 user_id값 확인:", profileData.user_id);
        setUserData(profileData);
      }
    };
    loadUserProfile();
  }, []);

  const handleImageUpload = (newImageUrl: string) => {
    setUserData((prev) => (prev ? { ...prev, user_img: newImageUrl } : null));
  };

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
          <ProfileImageUpload userId={userData.user_id} onImageUpload={handleImageUpload} />
          <div className="text-sm">
            <p>간단 자기소개</p>
            <p>간단 자기소개</p>
            <p>간단 자기소개</p>
          </div>
          <Link href={"/myrecipewirte"} className="mt-3 p-3 rounded-sm bg-orange-500 text-white">
            나만의 레시피 올리기
          </Link>
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </div>
  );
};

export default MyPageProfile;
