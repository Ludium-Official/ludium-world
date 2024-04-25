"use client";

import { useFormStatus } from "react-dom";
import { createMission } from "../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "미션을 추가하는 중입니다..." : "미션 추가하기"}
    </button>
  );
};

export default function CreateMissionButton({ learningId, curriculumId }) {
  const handleCreateMission = async () => {
    try {
      await createMission({ learningId, curriculumId });
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
