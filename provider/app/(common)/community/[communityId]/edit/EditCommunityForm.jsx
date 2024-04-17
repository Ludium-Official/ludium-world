"use client";

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
  const bannerRef = useRef();
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
      else alert("콘텐츠를 수정하는 중 에러가 발생했습니다.");

      return;
    }

    alert("콘텐츠가 수정되었습니다.");

    router.back();
    router.refresh();
  };

  const handleIgnoreEnterKeyDown = (keydownEvent) => {
    if (keydownEvent.key === "Enter") keydownEvent.preventDefault();
  };

  const handleClickBannerButton = () => {
    bannerRef.current.click();
  };

  const handleUploadImage = async (e) => {
    const avatarUploadFormData = new FormData();

    avatarUploadFormData.append("image", e.target.files[0]);

    const uploadAvatarImageResponse = await uploadImage(avatarUploadFormData);

    e.target.dataset.url = uploadAvatarImageResponse;
    setBannerUrl(uploadAvatarImageResponse);
  };

  return (
    <form className="frame-116" onSubmit={handleUpdateContent}>
      <div className="input-2">
        <label htmlFor="title" className="h5-18 color-gray-03">
          제목
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="text"
          placeholder="제목을 입력해주세요"
          name="title"
          id="title"
          defaultValue={content.title}
          onKeyDown={handleIgnoreEnterKeyDown}
        />
      </div>
      <div className="input-2">
        <label htmlFor="banner" className="h5-18 color-gray-03">
          배너
        </label>
        {bannerUrl === "" ? null : (
          <Image
            src={bannerUrl}
            alt={content.title}
            width={400}
            height={116}
            onClick={handleClickBannerButton}
          />
        )}
        <input
          className="image-hidden"
          ref={bannerRef}
          type="file"
          name="banner"
          id="banner"
          data-url={bannerUrl}
          onChange={handleUploadImage}
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor
            editorRef={editorRef}
            content={content.description}
            height="100%"
          />
        </div>
      </div>
      <div className="frame-157">
        <button
          className="button-L-2 background-purple-01 h5-18 color-white"
          disabled={pending}
        >
          {pending ? "수정하는 중입니다..." : "수정하기"}
        </button>
      </div>
    </form>
  );
}
