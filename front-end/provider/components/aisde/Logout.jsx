"use client";

import { logout } from "@/app/actions/logout";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <form className="gnb-menu-2" action={handleLogout}>
      <div className="icon-28"></div>
      <button className="text-wrapper h4-20">로그아웃</button>
    </form>
  );
}
