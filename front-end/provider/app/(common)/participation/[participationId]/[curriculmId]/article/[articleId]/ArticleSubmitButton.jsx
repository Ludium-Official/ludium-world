"use client";

import { ArticleSubmit } from "@/app/actions/article";

import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button className="button1 button-L" type="submit" disabled={pending}>
      {pending ? "아티클을 완료하는 중입니다..." : "아티클 완료하기"}
    </button>
  );
};

export default function ArticleSubmitbutton({
  learningId,
  curriculumId,
  articleId,
}) {
  const handleArticleSubmit = async () => {
    try {
      await ArticleSubmit({
        learningId,
        curriculumId,
        articleId,
      });

      alert("아티클을 완료했습니다.");
    } catch ({ message }) {
      alert(message);
    }
  };
  return (
    <form action={handleArticleSubmit}>
      <SubmitButton />
    </form>
  );
}
