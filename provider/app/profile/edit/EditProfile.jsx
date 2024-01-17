"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Editor from "../../../components/Editor";
import fetchWithRetry from "../../../functions/api";
import profilestyle from "../profile.module.css";
import HTTP_METHOD from "@/enums/HTTP_METHOD";

export default function EditProfile({ profile }) {
  const editorRef = useRef(null);
  const router = useRouter();

  if (!profile) return <h1>사용자 데이터를 불러오지 못했습니다.</h1>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nick, phone_number } = e.target;
    const { editorInstance } = editorRef.current;

    try {
      const res = await fetchWithRetry(`/profile`, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          nick: nick.value,
          phnNmb: phone_number.value,
          selfIntro: editorInstance.getMarkdown(),
        }),
      });

      if (res.ok) {
        router.push("/profile");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    router.push("/profile");
  };

  return (
    <form className={profilestyle["form-wrapper"]} onSubmit={handleSubmit}>
      <div className={profilestyle["form-button-area"]}>
        <button
          className={profilestyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={profilestyle["form-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={profilestyle["form-info"]}>
        <label className={profilestyle["form-label"]} htmlFor="nick">
          닉네임
        </label>
        <input
          className={profilestyle["form-text-field"]}
          type="text"
          name="nick"
          id="nick"
          placeholder="닉네임을 입력하세요"
          defaultValue={profile.nick}
        />
        <label className={profilestyle["form-label"]} htmlFor="phone_number">
          핸드폰번호
        </label>
        <input
          className={profilestyle["form-text-field"]}
          type="number"
          name="phone_number"
          id="phone_number"
          placeholder="'-' 없이 숫자만 입력해주세요."
          defaultValue={profile.phnNmb}
        />
        <label className={profilestyle["form-label"]}>자기소개</label>
      </div>
      <div className={profilestyle["form-content"]}>
        <Editor
          editorRef={editorRef}
          content={profile.selfIntro}
          height="100%"
        />
      </div>
    </form>
  );
}
