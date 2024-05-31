"use client";

import { useFormStatus } from "react-dom";
import { createArticle } from "../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "아티클을 추가하는 중입니다..." : "아티클 추가하기"}
    </button>
  );
};

export default function CreateArticleButton({ learningId, curriculumId }) {
  const handleCreateMission = async () => {
    try {
      await createArticle({ learningId, curriculumId });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleCreateMission}>
      <SubmitButton />
    </form>
  );
}
