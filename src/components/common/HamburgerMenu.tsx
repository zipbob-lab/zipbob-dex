import Image from "next/image";
import Link from "next/link";
import MainLogo from "@images/mainLogo.svg";
import { useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";
import { fetchUserProfile, useUserNickname } from "@/serverActions/profileAction";
import UserLevelEmoji from "../mypage/level/UserLevelEmoji";
import DefaultProfile from "@images/default-profile.svg";
import { useRouter } from "next/navigation";

interface HamburgerMenuType {
  isHamburgerMenuOpen: boolean;
  setIsHamburgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerMenu = ({ isHamburgerMenuOpen, setIsHamburgerMenuOpen }: HamburgerMenuType) => {
  const menuInside = useRef<HTMLDivElement | null>(null);
  const [userProfile, setUserProfile] = useState("");
  const { isLoggedIn, userId, logout } = useStore(useAuthStore);
  const { data: nickname } = useUserNickname(userId);
  const [rank, setRank] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      const userProfile = await fetchUserProfile();
      if (userProfile) {
        setRank(userProfile?.user_rank);
        setUserProfile(userProfile?.user_img || DefaultProfile);
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    if (isHamburgerMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (menuInside.current && !menuInside.current.contains(event.target as Node)) {
        setIsHamburgerMenuOpen(false); // 외부 클릭 시 메뉴 닫기
      }
    };

    if (isHamburgerMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHamburgerMenuOpen]);

  return (
    <>
      {isLoggedIn ? (
        <div
          className={`fixed ${isHamburgerMenuOpen ? "translate-x-0" : "-translate-x-full"} left-0 top-0 z-50 h-full w-full transform bg-[rgba(170,170,170,0.7)] transition-transform duration-300 ease-in-out`}
        >
          <div ref={menuInside} className="h-full w-[17rem] bg-white px-5 py-6">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <UserLevelEmoji userRank={rank} />
                <p className="text-title-18 text-Gray-900">{nickname}</p>
              </div>
              <div className="relative h-[2.75rem] w-[2.75rem]">
                {userProfile && (
                  <Image
                    src={userProfile}
                    sizes="2.75rem"
                    alt="유저 프로필"
                    fill
                    className="rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            <nav>
              <div className="mt-4 border-b border-[#dfdfdf]" />
              <ul className="mt-4 flex flex-col gap-4">
                <Link href="/" onClick={() => setIsHamburgerMenuOpen(false)}>
                  <li className="rounded-2xl px-3 py-2 text-body-16 transition hover:bg-Secondary-50">메인화면</li>
                </Link>
                <Link href="/fridge-list" onClick={() => setIsHamburgerMenuOpen(false)}>
                  <li className="rounded-2xl px-3 py-2 text-body-16 transition hover:bg-Secondary-50">냉장고 탐험</li>
                </Link>
                <Link href="/scraps" onClick={() => setIsHamburgerMenuOpen(false)}>
                  <li className="rounded-2xl px-3 py-2 text-body-16 transition hover:bg-Secondary-50">
                    스크랩한 레시피
                  </li>
                </Link>
                <Link href="/mypages" onClick={() => setIsHamburgerMenuOpen(false)}>
                  <li className="rounded-2xl px-3 py-2 text-body-16 transition hover:bg-Secondary-50">마이페이지</li>
                </Link>
                <li>
                  <span
                    className="cursor-pointer px-3 py-2 text-r-body-14 text-Gray-400"
                    onClick={() => {
                      setIsHamburgerMenuOpen(false);
                      logout();
                      router.replace("/");
                    }}
                  >
                    로그아웃
                  </span>
                </li>
              </ul>
            </nav>
            <div className="absolute bottom-6 h-[2.5rem] w-[5.125rem]">
              <Image src={MainLogo} alt="메인 로고" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`fixed ${isHamburgerMenuOpen ? "translate-x-0" : "-translate-x-full"} left-0 top-0 z-50 h-full w-full transform bg-[rgba(170,170,170,0.7)] transition-transform duration-300 ease-in-out`}
        >
          <div ref={menuInside} className="h-full w-[17rem] bg-white px-5 py-6">
            <p className="text-body-12 text-Gray-900">아직 계정이 없어요!</p>
            <div className="mt-1">
              <Link href="login" className="text-title-18 text-Primary-300">
                로그인 / 회원가입 하러가기
              </Link>
            </div>
            <nav>
              <div className="mt-4 border-b border-[#dfdfdf]" />
              <ul className="mt-4 flex flex-col gap-4">
                <Link href="/" onClick={() => setIsHamburgerMenuOpen(false)}>
                  <li className="rounded-2xl px-3 py-2 text-body-16 transition hover:bg-Secondary-50">메인화면</li>
                </Link>
                <Link href="/fridge-list" onClick={() => setIsHamburgerMenuOpen(false)}>
                  <li className="rounded-2xl px-3 py-2 text-body-16 transition hover:bg-Secondary-50">냉장고 탐험</li>
                </Link>
              </ul>
            </nav>
            <div className="absolute bottom-6 h-[2.5rem] w-[5.125rem]">
              <Image src={MainLogo} alt="메인 로고" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;
