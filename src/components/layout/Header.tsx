"use client";

import Image from "next/image";
import MainLogo from "@images/mainLogo.svg";
import Link from "next/link";
import AuthStatusBar from "./AuthStatusBar";
import SearchBar from "@/components/common/search/Searchbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId } from "@/serverActions/profileAction";
import LoginCheckModal from "../common/LoginCheckModal";

const Header = () => {
  const [isUser, setIsUser] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const userId = await getUserId();
      if (userId) {
        setIsUser(true);
      }
    };
    getUser();
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
    <header
      className={`box-border flex items-center justify-between ${pathname === "/" ? "bg-Secondary-100" : "border-b border-[#EAEAEA]"} px-5 py-2`}
    >
      <nav className="flex items-center gap-8">
        <Link href="/">
          <Image src={MainLogo} width={164} height={80} alt="메인 로고" />
        </Link>
        <Link href="/fridgeList" className="px-3 py-2 text-body-16 text-Gray-900">
          냉장고 탐험
        </Link>
        <Link href="/scraps" onClick={handleScrapClick} className="px-3 py-2 text-body-16 text-Gray-900">
          스크랩한 레시피
        </Link>
      </nav>
      <div className="flex-grow"></div>
      {pathname !== "/" && <SearchBar className="mr-4 h-[48px] w-[648px]" />}
      <AuthStatusBar isUser={isUser} />
      {/* 로그인 모달 */}
      {isLoginModal && <LoginCheckModal onClose={() => setIsLoginModal(false)} />}
    </header>
  );
};

export default Header;
