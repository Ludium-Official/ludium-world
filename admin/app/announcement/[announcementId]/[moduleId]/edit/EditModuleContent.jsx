"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import "tui-grid/dist/tui-grid.css";
import fetchWithRetry from "@/functions/api";
import announcementstyle from "@/app/announcement/announcement.module.css";
import Category from "@/enums/Category";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function EditModuleContent({ module }) {
  const editorRef = useRef(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    const { editorInstance } = editorRef.current;

    const editModuleResponse = await fetchWithRetry(
      `/announcement/${module.postingId}/${module.detailId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...module,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    if (editModuleResponse.ok) {
      router.back();
      router.refresh();
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <form
      className={`${announcementstyle["announcement-edit-wrapper"]} ${announcementstyle["form-wrapper"]}`}
      onSubmit={handleSubmit}
    >
      <div className={announcementstyle["announcement-edit-button-area"]}>
        <button
          className={announcementstyle["announcement-edit-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={announcementstyle["announcement-edit-button"]}
          type="submit"
          value={pending ? "작업을 저장하는 중입니다..." : "저장하기"}
          disabled={pending}
        />
      </div>
      <div className={announcementstyle["announcement-edit-header-area"]}>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={module.title}
          placeholder="제목을 입력해주세요"
        />
      </div>
      <input
        type="hidden"
        name="category"
        id="category"
        defaultValue={Category.MODULE}
      />
      <div className={announcementstyle["announcement-edit-content-area"]}>
        <Editor
          editorRef={editorRef}
          content={module.content}
          height={"100%"}
        />
      </div>
    </form>
  );
}
