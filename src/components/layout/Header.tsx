"use client";

import Image from "next/image";
import MainLogo from "@images/mainLogo.svg";
import Link from "next/link";
import AuthStatusBar from "./AuthStatusBar";
import SearchBar from "@/components/common/search/Searchbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId } from "@/serverActions/profileAction";
import MobileLogo from "@images/mobileLogo.svg";
import LoginCheckModal from "../common/modal/LoginCheckModal";
import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";
import HamburgerMenuIcon from "@images/hamburgerMenu.svg";
import HamburgerMenu from "../common/HamburgerMenu";
import Search from "@images/search.svg";
import MobileSearch from "../common/MobileSearch";

const Header = () => {
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
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
    <>
      <header className="fixed z-50 hidden w-full items-center justify-between border-b border-[#E5E5E5] bg-white px-3 py-3 md:flex xl:px-[3.75rem]">
        <nav className="flex flex-shrink-0 items-center lg:gap-2 xl:gap-8">
          <Link href="/" className="relative h-[3.5rem] w-[7.25rem]">
            <Image src={MainLogo} fill alt="메인 로고" />
          </Link>
          <Link href="/fridge-list" className="px-2 py-2 text-body-16 text-Gray-900 xl:px-3">
            냉장고 탐험
          </Link>
          <Link href="/scraps" onClick={handleScrapClick} className="px-2 py-2 text-body-16 text-Gray-900 xl:px-3">
            스크랩한 레시피
          </Link>
        </nav>
        {pathname !== "/" && <SearchBar className="mr-5" />}
        <AuthStatusBar />
        {/* 로그인 모달 */}
        {isLoginModal && <LoginCheckModal onClose={() => setIsLoginModal(false)} />}
      </header>
      <header className="fixed z-50 flex w-full items-center justify-between bg-white px-5 py-2 md:hidden">
        <div className="flex cursor-pointer" onClick={() => setIsHamburgerMenuOpen(true)}>
          <Image src={HamburgerMenuIcon} alt="햄버거 메뉴" className="h-auto w-auto" />
        </div>
        <div className="cursor-pointer p-[0.39rem]" onClick={() => router.push("/")}>
          <Image src={MobileLogo} alt="집밥도감 로고" className="h-auto w-auto" />
        </div>
        <div className="cursor-pointer" onClick={() => setIsSearching(true)}>
          <Image src={Search} alt="검색 아이콘" className="h-auto w-auto" />
        </div>
        {isSearching && <MobileSearch setIsSearching={setIsSearching} />}
        <HamburgerMenu isHamburgerMenuOpen={isHamburgerMenuOpen} setIsHamburgerMenuOpen={setIsHamburgerMenuOpen} />
      </header>
    </>
  );
};

export default Header;
