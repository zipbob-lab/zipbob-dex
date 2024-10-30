"use client";

import { getUserProfile } from "@/serverActions/profileAction";
import Image from "next/image";
import { useEffect, useState } from "react";
import DivideIcon from "../../../../public/images/divideIcon.svg";
import Link from "next/link";
import { useStore } from "zustand";
import { useDropboxStore } from "@/store/dropboxStore";
import { useAuthStore } from "@/store/authStore";

type AuthStatusBarProps = {
  isUser: boolean;
};

const AuthStatusBar = ({ isUser }: AuthStatusBarProps) => {
  const [userProfile, setUserProfile] = useState("");
  const { isOpen, setIsOpen } = useStore(useDropboxStore);
  const { isLoggedIn, setIsLoggedIn } = useStore(useAuthStore);

  useEffect(() => {
    if (isUser) {
      setIsLoggedIn(true);
    }
    const fetchUserProfile = async () => {
      const profileUrl = await getUserProfile();
      setUserProfile(profileUrl);
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser]);

  return (
    <>
      {isLoggedIn ? (
        <div className="w-15 h-15 bg-[#d9d9d9] rounded-full cursor-pointer" onClick={() => !isOpen && setIsOpen(true)}>
          {userProfile && <Image src={userProfile} alt="유저 프로필" width={60} height={60} className="rounded-full" />}
        </div>
      ) : (
        <div className="flex">
          <Link href="/sign-up" className="text-Gray-600 px-4 py-3 text-body-16">
            회원가입
          </Link>
          <Image src={DivideIcon} alt="구분선" />
          <Link href="/login" className="text-Gray-600 px-4 py-3 text-body-16">
            로그인
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthStatusBar;
