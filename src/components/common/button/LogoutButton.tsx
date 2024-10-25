"use client";

import browserClient from "@/supabase/client";

const LogoutButton = () => {
  const handleLogout = async () => {
    await browserClient.auth.signOut();
  };
  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
