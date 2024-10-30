"use client";

import { useAuthStore } from "@/store/authStore";
import { useDropboxStore } from "@/store/dropboxStore";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useStore } from "zustand";

const ProfileDropbox = () => {
  const { isOpen, setIsOpen } = useStore(useDropboxStore);
  const { logout } = useStore(useAuthStore);
  const dropboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropboxRef.current && !dropboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOpen) return null;

  return (
    <nav ref={dropboxRef} className="absolute right-5 px-4 py-2 min-w-[12rem] rounded-[1.25rem] border border-Gray-100">
      <ul className="flex flex-col gap-2">
        <li className="px-2 py-3 hover:bg-Secondary-50 rounded-2xl transition">
          <Link href="/">마이페이지</Link>
        </li>
        <li className="px-2 py-3 hover:bg-Secondary-50 rounded-2xl transition cursor-pointer" onClick={logout}>
          <button>로그아웃</button>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileDropbox;
