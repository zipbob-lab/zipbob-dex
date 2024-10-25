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
  );
}
