"use client";

import { useFormStatus } from "react-dom";
import { deleteContent } from "../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "콘텐츠를 삭제하는 중입니다..." : "삭제하기"}
    </button>
  );
};

export default function DeleteContentButton({ communityId }) {
  const handleDeleteContent = async () => {
    try {
      await deleteContent({ communityId });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleDeleteContent}>
      <SubmitButton />
    </form>
  );
}
