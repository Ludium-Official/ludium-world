"use client";

import { useFormStatus } from "react-dom";
import { pinWork, unpinWork } from "../actions";

const SubmitButton = ({ isPinned }) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {isPinned ? (
        <>{pending ? "고정 해제하는 중입니다." : "고정 해제 하기"}</>
      ) : (
        <>{pending ? "고정하는 중입니다." : "상단 고정 하기"}</>
      )}
    </button>
  );
};

export default function PinWorkButton({ workId, isPinned }) {
  const handlePinWork = async () => {
    try {
      if (isPinned) await unpinWork({ workId });
      else await pinWork({ workId });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handlePinWork}>
      <SubmitButton isPinned={isPinned} />
    </form>
  );
}
