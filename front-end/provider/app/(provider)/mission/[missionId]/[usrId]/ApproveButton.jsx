"use client";

import { MissionApprove } from "@/app/actions/mission";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ isApproved }) => {
  const { pending } = useFormStatus();

  return (
    <button className="button1 h5-18 button-L" type="submit" disabled={pending}>
      {isApproved
        ? "이미 승인되었습니다."
        : pending
        ? "승인하는 중입니다..."
        : "승인하기"}
    </button>
  );
};

export default function ApproveButton({ missionId, usrId, isApproved }) {
  const handleApprove = async () => {
    try {
      await MissionApprove({ missionId, usrId });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleApprove}>
      <SubmitButton isApproved={isApproved} />
    </form>
  );
}
