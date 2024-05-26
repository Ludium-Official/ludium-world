"use client";

import { signup } from "@/app/actions/account";
import { uploadImage } from "@/functions/actions/ImageUpload";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import signupstyle from "./signup.module.css";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      disabled={pending}
    >
      {pending ? "가입하는 중입니다..." : "가입하기"}
    </button>
  );
};

export default function SignUp() {
  const router = useRouter();
  const editorRef = useRef(null);
  const avatarRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("/icon_default_profile.png");
  const [pending, setPending] = useState(false);

  const handleSignup = async (userFormData) => {
    const { editorInstance } = editorRef.current;

    try {
      await signup({
        nick: userFormData.get("nick"),
        phnNmb: userFormData.get("phone_number"),
        selfIntro: editorInstance.getMarkdown(),
        avatar: avatarRef.current.dataset.url,
      });

      alert("회원가입이 완료되었습니다.");
      router.replace("/");
      router.refresh();
    } catch ({ message }) {
      alert(message);
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
      action={handleSignup}
    >
      <div className="frame-117-2">
        <div className="frame-116-2">
          <div className="frame-57">
            <h1 className="h4-20 color-black">회원가입</h1>
          </div>
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
                data-url={avatarUrl}
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
            />
          </div>
          <div className="input-2">
            <label className="h5-18 color-gray-03">자기소개</label>
            <div className="frame-102-4 background-white content-editor signup-editor">
              <Editor editorRef={editorRef} height="100%" />
            </div>
          </div>
        </div>
        <div className={signupstyle["form-button-area"]}>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
