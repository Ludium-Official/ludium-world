"use client";

import { useRef } from "react";
import applystyle from "../apply.module.css";
import { useRouter } from "next/navigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function EditApplyForm({
  announcementId,
  detailId,
  application,
}) {
  const router = useRouter();

  console.log(application);
  const editorRef = useRef();
  const handleApplyForm = async (e) => {
    e.preventDefault();
    const { editorInstance } = editorRef.current;

    const updateApplyResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${detailId}/application`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...application,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    if (!updateApplyResponse.ok) {
      const { message } = await updateApplyResponse.json();

      alert(message);
    } else {
      alert("지원서 수정이 완료되었습니다.");
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
          value="지원서 제출하기"
        />
      </div>
      <div className={applystyle["form-header"]}>
        <input
          className={applystyle["form-title"]}
          type="text"
          name="title"
          defaultValue={application.title}
          readOnly
        />
      </div>
      <div className={applystyle["content-area"]}>
        <Editor
          editorRef={editorRef}
          height="100%"
          content={application.description}
        />
      </div>
    </form>
  );
}
