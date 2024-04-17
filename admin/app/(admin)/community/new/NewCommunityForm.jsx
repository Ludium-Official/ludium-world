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

export default function NewCommunityForm({ type }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");

  const handleCreateContent = async (e) => {
    e.preventDefault();
    setPending(true);

    const { title, banner } = e.target;
    const { editorInstance } = editorRef.current;
    const url = type == null ? "/content" : `/content?type=${type}`;

    const createContentResponse = await fetchWithRetry(url, {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        title: title.value,
        description: editorInstance.getMarkdown(),
        banner: banner.dataset.url,
      }),
    });

    setPending(false);

    if (!createContentResponse.ok) {
      alert("콘텐츠를 저장하는 중 에러가 발생했습니다.");
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
    <form onSubmit={handleCreateContent}>
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
            onKeyDown={(evt) => {
              if (evt.key === "Enter") evt.preventDefault();
            }}
          />
        </section>
        <input
          type="file"
          name="banner"
          id="banner"
          data-url={bannerUrl}
          onChange={handleUploadImage}
        />
        {bannerUrl === "" ? null : (
          <Image src={bannerUrl} alt="배너 이미지" width={400} height={116} />
        )}
        <section className="editor">
          <Editor editorRef={editorRef} content="" height="100%" />
        </section>
      </article>
    </form>
  );
}
