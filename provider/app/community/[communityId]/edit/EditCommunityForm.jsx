"use client";

import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function EditCommunityForm({ content }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    setPending(true);

    const { editorInstance } = editorRef.current;

    const updateContentResponse = await fetchWithRetry(
      `/content/${content.contentId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...content,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    setPending(false);

    if (!updateContentResponse.ok) {
      if (updateContentResponse.status === 403)
        alert("콘텐츠는 작성자만 수정할 수 있습니다.");
      else alert("콘텐츠를 저장하는 중 에러가 발생했습니다.");

      return;
    }

    router.back();
    router.refresh();
  };

  return (
    <form className="wrapper" onSubmit={handleUpdateContent}>
      <div className="flex-end">
        <button className="button1" disabled={pending}>
          {pending ? "콘텐츠를 저장하는 중입니다..." : "콘텐츠 저장하기"}
        </button>
      </div>
      <article>
        <section className="margin1">
          <input
            className="input-title"
            type="text"
            name="title"
            placeholder=""
            defaultValue={content.title}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") evt.preventDefault();
            }}
          />
        </section>
        <section className="editor">
          <Editor
            editorRef={editorRef}
            content={content.description}
            height="100%"
          />
        </section>
      </article>
    </form>
  );
}
