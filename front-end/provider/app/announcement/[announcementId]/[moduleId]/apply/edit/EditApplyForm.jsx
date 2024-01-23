"use client";

import { useRef, useState } from "react";
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
  const [pending, setPending] = useState(false);

  const editorRef = useRef();
  const handleApplyForm = async (e) => {
    e.preventDefault();
    setPending(true);
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
    setPending(false);

    if (!updateApplyResponse.ok) {
      const { message } = await updateApplyResponse.json();

      alert(message);
    } else {
      alert("지원서 제출이 완료되었습니다.");
      router.refresh();
    }
  };

  return (
    <form className="wrapper" onSubmit={handleApplyForm}>
      <div className={applystyle["form-button-area"]}>
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
