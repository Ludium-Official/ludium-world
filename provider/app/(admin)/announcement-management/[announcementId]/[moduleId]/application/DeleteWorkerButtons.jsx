"use client";

import { useFormStatus } from "react-dom";
import { deleteWorker } from "../../../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "작업자 할당을 해제하는 중입니다..." : "할당 해제"}
    </button>
  );
};

export default function DeleteWorkerButton({ announcementId, worker }) {
  const handleDeleteWorker = async () => {
    try {
      await deleteWorker({
        announcementId,
        ...worker,
      });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleDeleteWorker}>
      <SubmitButton />
    </form>
  );
}
