"use client";

import browserClient from "@/supabase/client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    browserClient.auth.getSession().then(console.log);
  }, []);

  return <div>Home 페이지 입니다..</div>;
}
