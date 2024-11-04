"use client";

import { useAuthStore } from "@/store/authStore";
import { useDropboxStore } from "@/store/dropboxStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useStore } from "zustand";

const ProfileDropbox = () => {
  const { isOpen, setIsOpen } = useStore(useDropboxStore);
  const { logout } = useStore(useAuthStore);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <nav
      ref={dropboxRef}
      className="absolute right-5 min-w-[12rem] rounded-[1.25rem] border border-Gray-100 bg-white px-4 py-2"
    >
      <ul className="flex flex-col gap-2">
        <li
          className="cursor-pointer rounded-2xl px-2 py-3 transition hover:bg-Secondary-50"
          onClick={() => router.push("/mypages")}
        >
          <button>마이페이지</button>
        </li>
        <li className="cursor-pointer rounded-2xl px-2 py-3 transition hover:bg-Secondary-50" onClick={logout}>
          <button>로그아웃</button>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileDropbox;
