"use client";

import Editor from "../../components/Editor";
import { useRef } from "react";
import fetchWithRetry from "../../functions/api";
import { useRouter } from "next/navigation";
import signupstyle from "./signup.module.css";

export default function SignUp() {
  const router = useRouter();
  const editorRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { editorInstance } = editorRef.current;

    try {
      const createUserSignResponse = await fetchWithRetry(
        `/user/sign-up/google`,
        {
          method: "POST",
          body: JSON.stringify({
            nick: e.target.nick.value,
            phnNmb: e.target.phone_number.value,
            selfIntro: editorInstance.getMarkdown(),
          }),
        }
      );

      if (createUserSignResponse.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {}
  };
  return (
    <form className={signupstyle["form-wrapper"]} onSubmit={handleSubmit}>
      <div className={signupstyle["form-button-area"]}>
        <input
          className={signupstyle["form-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={signupstyle["form-info"]}>
        <label className={signupstyle["form-label"]} htmlFor="nick">
          닉네임
        </label>
        <input
          className={signupstyle["form-text-field"]}
          type="text"
          name="nick"
          id="nick"
          placeholder="닉네임을 입력하세요"
        />
        <label className={signupstyle["form-label"]} htmlFor="phone_number">
          핸드폰번호
        </label>
        <input
          className={signupstyle["form-text-field"]}
          type="number"
          name="phone_number"
          id="phone_number"
          placeholder="'-' 없이 숫자만 입력해주세요."
        />
        <label className={signupstyle["form-label"]}>자기소개</label>
      </div>
      <div className={signupstyle["form-content"]}>
        <Editor editorRef={editorRef} height="100%" />
      </div>
    </form>
  );
}
