"use client";

import { useFormStatus } from "react-dom";
import { pinAnnouncement, unpinAnnouncement } from "../actions";

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

export default function PinAnnouncementButton({ announcementId, isPinned }) {
  const handlePinAnnouncement = async () => {
    try {
      if (isPinned) {
        await unpinAnnouncement({ announcementId });
        alert("상단 고정이 해제되었습니다.");
      } else {
        await pinAnnouncement({ announcementId });
        alert("상단 고정되었습니다.");
      }
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handlePinAnnouncement}>
      <SubmitButton isPinned={isPinned} />
    </form>
  );
}
