"use client";

import { useRef, useState } from "react";
import applystyle from "./apply.module.css";
import { useRouter } from "next/navigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ApplyForm({
  announcementId,
  detailId,
  applicationTemplate,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const editorRef = useRef();
  const handleApplyForm = async (e) => {
    e.preventDefault();
    setPending(true);
    const { editorInstance } = editorRef.current;

    const createApplyResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${detailId}/application`,
      {
        method: "POST",
        body: JSON.stringify({
          ...applicationTemplate,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    if (!createApplyResponse.ok) {
      alert("지원서 제출하던 중 에러가 발생했습니다.");
      setPending(false);
    } else {
      alert("지원서 제출이 완료되었습니다.");
      router.back();
      router.refresh();
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <form className={applystyle.form} onSubmit={handleApplyForm}>
      <div className={applystyle["form-button-area"]}>
        <button
          className={applystyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={applystyle["form-button"]}
          type="submit"
          value={pending ? "지원서를 제출하는 중입니다..." : "지원서 제출하기"}
          disabled={pending}
        />
      </div>
      <div className={applystyle["form-header"]}>
        <input
          className={applystyle["form-title"]}
          type="text"
          name="title"
          defaultValue={applicationTemplate.title}
          readOnly
        />
      </div>
      <div className={applystyle["content-area"]}>
        <Editor
          editorRef={editorRef}
          height="100%"
          content={applicationTemplate.description}
        />
      </div>
    </form>
  );
}
