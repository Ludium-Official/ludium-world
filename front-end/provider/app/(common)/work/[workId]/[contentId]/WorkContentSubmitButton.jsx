"use client";

import { submitWorkContent } from "@/app/actions/work";
import Icon from "@/components/Icon";
import WORK_CONTENT_STATUS from "@/enums/WORK_CONTENT_STATUS";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="frame-56 background-white border-none"
      type="submit"
      disabled={pending}
    >
      <Icon
        src="/icon_flag_purple01.svg"
        alt="제출하기"
        width={24}
        height={24}
      />
      <p className="h4-20 color-purple-01">
        {pending ? "제출중..." : "제출하기"}
      </p>
    </button>
  );
};

export default function WorkContentSubmitButton({ detailContent }) {
  const handleSubmitWorkContent = async () => {
    try {
      await submitWorkContent({
        detailContent,
        status: WORK_CONTENT_STATUS.SUBMIT,
      });
      alert("작업물이 제출되었습니다.");
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleSubmitWorkContent}>
      <SubmitButton />
    </form>
  );
}
