"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import fetchWithRetry from "../../../../functions/api";
import announcementstyle from "../../announcement.module.css";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function EditAnnouncement({ postingId, title, description }) {
  const editorRef = useRef(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setPending(true);

    const { editorInstance } = editorRef.current;

    const createAnnouncementResponse = await fetchWithRetry(
      `/announcement/${postingId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          postingId: postingId,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    if (createAnnouncementResponse.ok) {
      router.back();
      router.refresh();
    }
  };

  const handleBack = () => {
    router.push("/announcement");
  };

  return (
    <form className={announcementstyle["form-wrapper"]} onSubmit={handleSave}>
      <div className={announcementstyle["form-button-area"]}>
        <button
          className={announcementstyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={announcementstyle["form-button"]}
          type="submit"
          value={pending ? "공고를 저장하는 중입니다..." : "저장하기"}
          disabled={pending}
        />
      </div>
      <div className={announcementstyle["form-header"]}>
        <input
          className={announcementstyle["form-title"]}
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          defaultValue={title}
        />
      </div>
      <div className={announcementstyle["form-content-area"]}>
        <Editor editorRef={editorRef} content={description} height="100%" />
      </div>
    </form>
  );
}
