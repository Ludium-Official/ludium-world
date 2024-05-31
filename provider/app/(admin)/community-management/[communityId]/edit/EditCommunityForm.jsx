"use client";

import { uploadImage } from "@/functions/actions/ImageUpload";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateContent } from "../../actions";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "콘텐츠를 저장하는 중입니다..." : "콘텐츠 저장하기"}
    </button>
  );
};

export default function EditCommunityForm({
  content: { title, description, banner, ...content },
}) {
  const editorRef = useRef();
  const bannerRef = useRef();
  const [bannerUrl, setBannerUrl] = useState(banner);

  const handleUpdateContent = async (contentData) => {
    const { editorInstance } = editorRef.current;

    try {
      await updateContent({
        title: contentData.get("title"),
        description: editorInstance.getMarkdown(),
        banner: bannerUrl,
        content,
      });
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
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          defaultValue={title}
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
            alt={title}
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
          <Editor editorRef={editorRef} content={description} height="100%" />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
