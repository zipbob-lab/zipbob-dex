import Image from "next/image";
import MainLogo from "../../../../public/images/headerLogo.svg";
import Link from "next/link";
import { getIsLogin } from "@/supabase/server";
import AuthStatusBar from "./AuthStatusBar";

const Header = async () => {
  const isUser = await getIsLogin();

  return (
    <header className="flex items-center justify-between px-5 py-2 border-b-[#EAEAEA] border-b box-border">
      <nav className="flex gap-8 items-center">
        <Link href="/">
          <Image src={MainLogo} width={164} height={80} alt="헤더 로고" />
        </Link>
        <Link href="/" className="text-body-16 px-3 py-2 text-Gray-900">
          냉장고 탐험
        </Link>
        <Link href="/scraps" className="text-body-16 px-3 py-2 text-Gray-900">
          스크랩한 레시피
        </Link>
        <Link href="/RecipeAll" className="text-body-16 px-3 py-2 text-Gray-900">
          전체 레시피
        </Link>
      </nav>
      <AuthStatusBar isUser={isUser} />
    </header>
  );
};

export default Header;
