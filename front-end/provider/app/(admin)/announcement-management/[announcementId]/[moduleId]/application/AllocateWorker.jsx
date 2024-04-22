"use client";

import { useFormStatus } from "react-dom";
import { allocateWorker } from "../../../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "작업자를 할당하는 중입니다..." : "작업자 할당"}
    </button>
  );
};

export default function AllocateWorker({
  announcementId,
  detailId,
  usrId,
  role,
}) {
  const handleAllocateWorker = async () => {
    try {
      await allocateWorker({
        announcementId,
        detailId,
        usrId,
        role,
      });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleAllocateWorker}>
      <SubmitButton />
    </form>
  );
}
