"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <h1>Home 입니다...</h1>
      <Link href={"/login"}>로그인 페이지로 이동</Link>
      <Link href={"/RecipeAll"}>전체 레시피 화면으로 이동</Link>
    </div>
  );
}
