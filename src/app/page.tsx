<<<<<<< HEAD
"use client";

import browserClient from "@/supabase/client";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    browserClient.auth.getSession().then(console.log);
  }, []);

  return (
    <>
      <div>Home 페이지 입니다..</div>
      <Link href="/login">로그인페이지</Link>
    </>
=======
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <h1>Home 입니다...</h1>
      <Link href={"/login"}>로그인 페이지로 이동</Link>
      <Link href={"/RecipeAll"}>전체 레시피 화면으로 이동</Link>
    </div>
>>>>>>> 0063eb1e0a19afb7fa8368b5db763bac577bcc30
  );
}
