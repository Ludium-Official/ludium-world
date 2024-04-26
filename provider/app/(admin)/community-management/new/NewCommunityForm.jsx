"use client";

import { uploadImage } from "@/functions/actions/ImageUpload";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createContent } from "../actions";
import ko_kr from "@/langs/ko_kr";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = ({ type }) => {
  const { pending } = useFormStatus();
  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {ko_kr[type]}
      {pending ? "을(를) 저장하는 중입니다..." : " 저장하기"}
    </button>
  );
};

export default function NewCommunityForm({ type }) {
  const editorRef = useRef();
  const bannerRef = useRef();
  const [bannerUrl, setBannerUrl] = useState("");

  const handleCreateContent = async (contentData) => {
    const { editorInstance } = editorRef.current;
    try {
      createContent({
        title: contentData.get("title"),
        description: editorInstance.getMarkdown(),
        banner: bannerUrl,
        type,
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
    <form className="frame-116" action={handleCreateContent}>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="title">
          제목
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          onKeyDown={handleIgnoreEnterKeyDown}
        />
      </div>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="banner">
          배너
        </label>
        {bannerUrl === "" ? null : (
          <Image
            src={bannerUrl}
            alt="배너 이미지"
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
          <Editor editorRef={editorRef} content="" height="100%" />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton type={type} />
      </div>
    </form>
  );
}
