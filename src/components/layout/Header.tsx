"use client";

import Image from "next/image";
import MainLogo from "@images/mainLogo.svg";
import Link from "next/link";
import AuthStatusBar from "./AuthStatusBar";
import SearchBar from "@/components/common/search/Searchbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId } from "@/serverActions/profileAction";

import LoginCheckModal from "../common/modal/LoginCheckModal";

import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const [isLoginModal, setIsLoginModal] = useState(false);
  const { setIsLoggedIn, setUserId } = useStore(useAuthStore);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const userId = await getUserId();
      if (userId) {
        setIsLoggedIn(true);
        setUserId(userId);
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrapClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const userId = await getUserId();
    if (userId) {
      router.push("/scraps");
    } else {
      setIsLoginModal(true);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-[#E5E5E5] px-[1.25rem] py-3 xl:px-[3.75rem]">
      <nav className="flex items-center gap-4 md:gap-8">
        <Link href="/" className="relative h-[2rem] w-[4.14rem] md:h-[3.5rem] md:w-[7.25rem]">
          <Image src={MainLogo} fill alt="메인 로고" />
        </Link>
        <Link
          href="/fridge-list"
          className="px-[0.5rem] py-[0.35rem] text-body-13 text-Gray-900 md:px-3 md:py-2 md:text-body-16"
        >
          냉장고 탐험
        </Link>
        <Link
          href="/scraps"
          onClick={handleScrapClick}
          className="px-[0.5rem] py-[0.25rem] text-body-13 text-Gray-900 md:px-3 md:py-2 md:text-body-16"
        >
          스크랩한 레시피
        </Link>
      </nav>
      {pathname !== "/" && <SearchBar className="mr-4 h-[48px] w-[648px]" />}
      <AuthStatusBar />
      {/* 로그인 모달 */}
      {isLoginModal && <LoginCheckModal onClose={() => setIsLoginModal(false)} />}
    </header>
  );
};

export default Header;
