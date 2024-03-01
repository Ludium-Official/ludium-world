"use client";

import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import { uploadImage } from "@/functions/actions/ImageUpload";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function EditCommunityForm({ content }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(content.banner);

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    setPending(true);

    const { title, banner } = e.target;
    const { editorInstance } = editorRef.current;

    const updateContentResponse = await fetchWithRetry(
      `/content/${content.contentId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...content,
          title: title.value,
          description: editorInstance.getMarkdown(),
          banner: banner.dataset.url,
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

  const handleUploadImage = async (e) => {
    const avatarUploadFormData = new FormData();

    avatarUploadFormData.append("image", e.target.files[0]);

    const uploadAvatarImageResponse = await uploadImage(avatarUploadFormData);

    e.target.dataset.url = uploadAvatarImageResponse;
    setBannerUrl(uploadAvatarImageResponse);
  };

  return (
    <form onSubmit={handleUpdateContent}>
      <ContentNavigation links={[]}>
        <BackButton />
        <button disabled={pending}>
          {pending ? "콘텐츠를 저장하는 중입니다..." : "콘텐츠 저장하기"}
        </button>
      </ContentNavigation>
      <article className="wrapper">
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
          <input
            type="file"
            name="banner"
            id="banner"
            dataset={bannerUrl}
            onChange={handleUploadImage}
          />
          {bannerUrl === "" ? null : (
            <Image
              src={bannerUrl}
              alt={content.title}
              width={400}
              height={116}
            />
          )}
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
