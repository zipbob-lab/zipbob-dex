"use client";

import Image from "next/image";
import MainLogo from "@images/mainLogo.svg";
import Link from "next/link";
import AuthStatusBar from "./AuthStatusBar";
import SearchBar from "@/components/common/searchbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId } from "@/serverActions/profileAction";

const Header = () => {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userId = await getUserId();
      if (userId) {
        setIsUser(true);
      }
    };
    getUser();
  }, []);

  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-5 py-2 border-b-[#EAEAEA] border-b box-border">
      <nav className="flex gap-8 items-center">
        <Link href="/">
          <Image src={MainLogo} width={164} height={80} alt="메인 로고" />
        </Link>
        <Link href="/fridgeList" className="text-body-16 px-3 py-2 text-Gray-900">
          냉장고 탐험
        </Link>
        <Link href="/scraps" className="text-body-16 px-3 py-2 text-Gray-900">
          스크랩한 레시피
        </Link>
      </nav>
      {pathname !== "/" && <SearchBar />}
      <AuthStatusBar isUser={isUser} />
    </header>
  );
};

export default Header;
