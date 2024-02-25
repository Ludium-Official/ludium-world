"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccount() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setPending(true);

    const deleteAccountResponse = await fetchWithRetry(`/user`, {
      method: HTTP_METHOD.DELETE,
    });

    setPending(false);
    alert("탈퇴 신청이 완료되었습니다.");
    router.replace("/");
    router.refresh();
  };
  return (
    <form onSubmit={handleDeleteAccount}>
      <div className="frame-101">
        <button
          className="button-L-2 background-purple-01 h5-18 color-white"
          disabled={pending}
        >
          {pending ? "탈퇴 처리중입니다..." : "탈퇴신청"}
        </button>
      </div>
    </form>
  );
}
