"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "../../../components/Editor";
import fetchWithRetry from "../../../functions/api";
import { uploadImage } from "@/functions/actions/ImageUpload";
import Image from "next/image";
import Link from "next/link";

export default function EditProfile({ profile }) {
  const editorRef = useRef(null);
  const avatarRef = useRef(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar);

  if (!profile) return <h1>사용자 데이터를 불러오지 못했습니다.</h1>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    const { nick, phone_number, avatar } = e.target;
    const { editorInstance } = editorRef.current;

    try {
      const res = await fetchWithRetry(`/profile`, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          nick: nick.value,
          phnNmb: phone_number.value,
          selfIntro: editorInstance.getMarkdown(),
          avatar: avatar.dataset.url,
        }),
      });

      if (res.ok) {
        router.push("/profile");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const handleClickAvatarButton = (e) => {
    avatarRef.current.click();
  };

  const handleUploadImage = async (e) => {
    const avatarUploadFormData = new FormData();

    avatarUploadFormData.append("image", e.target.files[0]);

    const uploadAvatarImageResponse = await uploadImage(avatarUploadFormData);

    e.target.dataset.url = uploadAvatarImageResponse;
    setAvatarUrl(uploadAvatarImageResponse);
  };

  return (
    <form
      className="frame-34-10 background-white border-gray-06"
      onSubmit={handleSubmit}
    >
      <div className="frame-117-2">
        <div className="frame-116-2">
          <div className="input-2">
            <label className="h5-18 color-gray-03" htmlFor="avatar">
              이미지
            </label>
            <div className="group-8">
              <Image
                className="avatar"
                src={avatarUrl}
                alt="아바타"
                width={60}
                height={60}
                onClick={handleClickAvatarButton}
              />
              <input
                className="avatar-hidden"
                ref={avatarRef}
                type="file"
                id="avatar"
                name="avatar"
                data-url={null}
                onChange={handleUploadImage}
              />
            </div>
          </div>
          <div className="input-2">
            <label className="h5-18 color-gray-03" htmlFor="nick">
              닉네임
            </label>
            <input
              className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
              type="text"
              name="nick"
              id="nick"
              placeholder="닉네임을 입력하세요"
              defaultValue={profile.nick}
            />
          </div>
          <div className="input-2">
            <label className="h5-18 color-gray-03" htmlFor="phone_number">
              핸드폰번호
            </label>
            <input
              className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
              type="number"
              name="phone_number"
              id="phone_number"
              placeholder="'-' 없이 숫자만 입력해주세요."
              defaultValue={profile.phnNmb}
            />
          </div>
          <div className="input-2">
            <label className="h5-18 color-gray-03">자기소개</label>
          </div>
          <div className="frame-102-4 background-white content-editor">
            <Editor
              editorRef={editorRef}
              content={profile.selfIntro}
              height="100%"
            />
          </div>
        </div>
        <div className="flex-end">
          <button
            className="button-L-2 background-purple-01 h5-18 color-white"
            disabled={pending}
          >
            {pending ? "프로필 적용을 진행중입니다..." : "프로필 적용"}
          </button>
        </div>
        <div className="frame-119">
          <Link className="link" href="/profile/delete">
            <p className="p5-18 color-alert">회원 탈퇴 페이지로 이동</p>
          </Link>
        </div>
      </div>
    </form>
  );
}
