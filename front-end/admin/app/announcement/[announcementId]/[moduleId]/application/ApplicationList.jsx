"use client";

import { useRouter } from "next/navigation";
import announcementstyle from "@/app/announcement/announcement.module.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export default function ApplicationList({ announcementId, applicationList }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleAllocateWorker = async (detailId, usrId, role) => {
    setPending(true);
    const createAllocateWorkerResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${detailId}/worker`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({ detailId, usrId, role }),
      }
    );

    setPending(false);

    if (!createAllocateWorkerResponse.ok)
      throw new Error("작업자를 할당하는 중 에러가 발생했습니다.");

    router.refresh();
  };

  return (
    <>
      {applicationList.map(
        ({ applicationId, nick, description, detailId, usrId, role }) => (
          <section
            className={`${announcementstyle["announcement-list"]}`}
            key={applicationId}
          >
            <div>
              <button
                type="button"
                onClick={() => handleAllocateWorker(detailId, usrId, role)}
                disabled={pending}
              >
                {pending ? "작업자를 할당하는 중입니다..." : "작업자 할당"}
              </button>
            </div>
            <h3>지원자: {nick}</h3>
            <article className={announcementstyle["content-area"]}>
              <Viewer content={description} heihgt="100%" />
            </article>
          </section>
        )
      )}
    </>
  );
}
