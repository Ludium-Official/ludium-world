"use client";

import COMMUNITY_TYPE from "@/enums/COMMUNITY_TYPE";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import { uploadImage } from "@/functions/actions/ImageUpload";
import fetchWithRetry from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function NewCommunityForm() {
  const router = useRouter();
  const editorRef = useRef();
  const bannerRef = useRef();
  const [pending, setPending] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");

  const handleCreateContent = async (e) => {
    e.preventDefault();
    setPending(true);

    const { title, banner } = e.target;
    const { editorInstance } = editorRef.current;

    const createContentResponse = await fetchWithRetry(
      `/content?type=${e.target.type.value}`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          title: title.value,
          description: editorInstance.getMarkdown(),
          banner: banner.dataset.url,
        }),
      }
    );

    setPending(false);

    if (!createContentResponse.ok) {
      alert("콘텐츠를 저장하는 중 에러가 발생했습니다.");
      return;
    }

    alert("콘텐츠가 저장되었습니다.");
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
    <form className="frame-116" onSubmit={handleCreateContent}>
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
        <button
          className="button-L-2 background-purple-01 h5-18 color-white"
          disabled={pending}
        >
          {pending ? "저장하는 중입니다..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
