"use client";

import { deleteAccount } from "@/app/actions/account";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      disabled={pending}
    >
      {pending ? "탈퇴 처리중입니다..." : "탈퇴신청"}
    </button>
  );
};

export default function DeleteAccount() {
  const router = useRouter();

  const handleDeleteAccount = async (e) => {
    try {
      await deleteAccount();
      alert("탈퇴 신청이 완료되었습니다.");

      router.replace("/");
      router.refresh();
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleDeleteAccount}>
      <div className="frame-101">
        <SubmitButton />
      </div>
    </form>
  );
}
