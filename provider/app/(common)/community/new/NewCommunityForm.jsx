"use client";

import { createContent } from "@/app/actions/content";
import COMMUNITY_TYPE from "@/enums/COMMUNITY_TYPE";
import { uploadImage } from "@/functions/actions/ImageUpload";
import ko_kr from "@/langs/ko_kr";
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
      disabled={pending}
    >
      {pending ? "저장하는 중입니다..." : "저장하기"}
    </button>
  );
};

export default function NewCommunityForm() {
  const editorRef = useRef();
  const bannerRef = useRef();
  const [bannerUrl, setBannerUrl] = useState("");

  const handleCreateContent = async (contentFormData) => {
    const { editorInstance } = editorRef.current;

    try {
      await createContent({
        type: contentFormData.get("type"),
        title: contentFormData.get("title"),
        description: editorInstance.getMarkdown(),
        banner: bannerRef.current.dataset.url,
      });
      alert("콘텐츠가 저장되었습니다.");
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
          placeholder="제목을 입력해주세요"
          name="title"
          id="title"
          onKeyDown={handleIgnoreEnterKeyDown}
        />
      </div>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="type">
          유형
        </label>
        <select
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          name="type"
          id="type"
        >
          <option value={COMMUNITY_TYPE.CONTENT}>{ko_kr.CONTENT}</option>
          <option value={COMMUNITY_TYPE.QUESTION}>{ko_kr.QUESTION}</option>
          <option value={COMMUNITY_TYPE.FREE}>{ko_kr.FREE}</option>
        </select>
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
          id="banner"
          name="banner"
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
        <SubmitButton />
      </div>
    </form>
  );
}
