"use client";

import APPLY_CATEGORY from "@/enums/APPLY_CATEGORY";
import { useRouter } from "next/navigation";

export default function RedirectApplicationButton({
  announcementId,
  detailId,
  isClosed,
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
      disabled={isClosed}
    >
      <h4 className="h5-18 color-white">
        {isClosed ? "마감되었습니다" : "지원하기"}
      </h4>
    </button>
  );
}
