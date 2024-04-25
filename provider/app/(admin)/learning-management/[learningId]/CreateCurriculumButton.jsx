"use client";

import { useFormStatus } from "react-dom";
import { createCurriculum } from "../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "커리큘럼을 추가하는 중입니다..." : "커리큘럼 추가하기"}
    </button>
  );
};

export default function CreateCurriculumButton({ learningId }) {
  const handleCreateCurriculum = async () => {
    try {
      await createCurriculum({ learningId });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form className="flex-end" action={handleCreateCurriculum}>
      <SubmitButton />
    </form>
  );
}
