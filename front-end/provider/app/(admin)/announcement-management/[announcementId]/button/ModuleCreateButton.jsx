"use client";

import { useFormStatus } from "react-dom";
import { createDetailedAnnouncement } from "../../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "작업 추가하는 중입니다..." : "작업 추가하기"}
    </button>
  );
};

export default function ModuleCreateButton({ announcementId }) {
  const handleCreateDetailedAnnouncement = async () => {
    try {
      await createDetailedAnnouncement({ announcementId });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form action={handleCreateDetailedAnnouncement}>
      <SubmitButton />
    </form>
  );
}
