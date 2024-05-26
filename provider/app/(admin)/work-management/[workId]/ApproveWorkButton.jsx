"use client";

import { useFormStatus } from "react-dom";
import { approveWork } from "../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="frame-56 background-white border-none link h4-20 color-purple-01"
      type="submit"
      disabled={pending}
    >
      {pending ? "작업을 승인하는 중입니다..." : "승인하기"}
    </button>
  );
};

export default function ApproveWorkButton({ work }) {
  const handleApproveWork = async () => {
    try {
      await approveWork({ work });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleApproveWork}>
      <SubmitButton />
    </form>
  );
}
