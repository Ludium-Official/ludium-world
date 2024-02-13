"use client";

import APPLY_CATEGORY from "@/enums/APPLY_CATEGORY";
import { useRouter } from "next/navigation";

export default function RedirectApplicationButton({
  announcementId,
  detailId,
}) {
  const router = useRouter();

  const handleRedirectApplication = () => {
    router.push(
      `/announcement/${announcementId}/${detailId}/apply?role=${APPLY_CATEGORY.PROVIDER}`
    );
  };

  return (
    <button
      className="button-S background-purple-01"
      type="button"
      onClick={handleRedirectApplication}
    >
      <h4 className="h5-18 color-white">지원하기</h4>
    </button>
  );
}
