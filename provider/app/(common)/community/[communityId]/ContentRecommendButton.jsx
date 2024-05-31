"use client";

import {
  cancleRecommendContent,
  recommendContent,
} from "@/app/actions/content";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ isContentRecommendExist }) => {
  const { pending } = useFormStatus();

  return (
    <button className="button2 caption-12" type="submit" disabled={pending}>
      {isContentRecommendExist ? (
        <>{pending ? "해제중.." : "추천 해제"}</>
      ) : (
        <>{pending ? "추천중.." : "추천"}</>
      )}
    </button>
  );
};

export default function ContentRecommendButton({
  contentId,
  isContentRecommendExist,
}) {
  const handleRecommendContent = async () => {
    try {
      if (isContentRecommendExist) {
        await cancleRecommendContent({ contentId });
        alert("추천이 해제되었습니다.");
      } else {
        await recommendContent({ contentId });
        alert("추천되었습니다.");
      }
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleRecommendContent}>
      <SubmitButton isContentRecommendExist={isContentRecommendExist} />
    </form>
  );
}
