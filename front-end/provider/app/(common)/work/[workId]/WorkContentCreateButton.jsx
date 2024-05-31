"use client";

import { createWorkContent } from "@/app/actions/work";
import Icon from "@/components/Icon";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="button-M" type="submit" disabled={pending}>
      <Icon
        src="/icon_plus_white.svg"
        alt="작업물 추가"
        width={24}
        height={24}
      />
      <p className="h5-18 color-white">
        {pending ? "추가중..." : "작업물 추가"}
      </p>
    </button>
  );
};

export default function WorkContentCreateButton({ workId }) {
  const handleCreateWorkContent = async () => {
    try {
      await createWorkContent({ workId });
      alert("작업물을 추가했습니다.");
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form className="flex-end margin1" action={handleCreateWorkContent}>
      <SubmitButton />
    </form>
  );
}
