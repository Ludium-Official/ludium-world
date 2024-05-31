"use client";

import { updateContent } from "@/app/actions/content";
import { uploadImage } from "@/functions/actions/ImageUpload";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "수정하는 중입니다..." : "수정하기"}
    </button>
  );
};

export default function EditCommunityForm({ content }) {
  const editorRef = useRef();
  const bannerRef = useRef();
  const [bannerUrl, setBannerUrl] = useState(content.banner);

  const handleUpdateContent = async (contentFormData) => {
    const { editorInstance } = editorRef.current;

    try {
      await updateContent({
        content,
        title: contentFormData.get("title"),
        description: editorInstance.getMarkdown(),
        banner: bannerRef.current.dataset.url,
      });
      alert("콘텐츠가 수정되었습니다.");
    } catch ({ message }) {
      alert(message);
    }
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
    <form className="frame-116" action={handleUpdateContent}>
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
        <SubmitButton />
      </div>
    </form>
  );
}
