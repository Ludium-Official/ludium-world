"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import applystyle from "./apply.module.css";
import BackButton from "@/components/BackButton";

export default function RedirectEditPage({ announcementId, moduleId, role }) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace(
        `/announcement/${announcementId}/${moduleId}/apply/edit?role=${role}`
      );
    }, 2000);
  }, []);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className={`wrapper ${applystyle.error}`}>
        <h1 className={applystyle.title}>
          이미 지원서를 제출했습니다. 곧 지원서 수정페이지로 연결됩니다.
        </h1>
      </article>
    </>
  );
}
