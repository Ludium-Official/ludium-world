"use client";

import announcementstyle from "@/app/announcement/announcement.module.css";
import BackButton from "@/components/BackButton";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function CreateApplicationTemplateForm({
  announcementId,
  detailId,
  role,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const editorRef = useRef();
  const handleApplyForm = async (e) => {
    e.preventDefault();
    setPending(true);
    const { editorInstance } = editorRef.current;

    const createApplicationTemplateResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${detailId}/application-template`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
          role,
          detailId,
        }),
      }
    );

    if (!createApplicationTemplateResponse.ok) {
      setPending(false);
      throw new Error("지원서 양식을 저장하는 중에 에러가 발생했습니다.");
    }

    router.back();
    router.refresh();
  };

  return (
    <form
      className={announcementstyle["form-wrapper"]}
      onSubmit={handleApplyForm}
    >
      <div className={announcementstyle["form-button-area"]}>
        <BackButton className={announcementstyle["form-button"]} />
        <input
          className={announcementstyle["form-button"]}
          type="submit"
          value={pending ? "지원서 양식을 저장하는 중입니다..." : "저장하기"}
          disabled={pending}
        />
      </div>
      <div className={announcementstyle["form-header"]}>
        <input
          className={announcementstyle["form-title"]}
          type="text"
          name="title"
          defaultValue=""
          placeholder="지원서 양식의 제목을 입력해주세요"
        />
      </div>
      <div className={announcementstyle["form-content-area"]}>
        <Editor editorRef={editorRef} height="100%" />
      </div>
    </form>
  );
}
