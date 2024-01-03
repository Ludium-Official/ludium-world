"use client";

import BackButton from "@/components/BackButton";
import applystyle from "./apply.module.css";

export default function ApplyErrorPage({ error }) {
  console.log(error);
  const handleSignUp = () => {
    router.replace("/sign-up");
  };

  const getApplicationErrorComponents = (status) => {
    switch (status) {
      case "401":
        return (
          <>
            <h1>로그인 혹은 회원가입을 먼저 해주세요.</h1>
            <button onClick={handleSignUp}>회원가입 하러 가기</button>
          </>
        );
      case "404":
        return <h1>지원서 양식이 작성되지 않았습니다.</h1>;
    }
  };

  return (
    <article className={`${applystyle.wrapper} ${applystyle.error}`}>
      <BackButton />
      {getApplicationErrorComponents(error.message)}
    </article>
  );
}
