"use client";

import { useRouter } from "next/navigation";
import Icon from "./Icon";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <div className="icon-28">
        <Icon
          className="back-button-icon"
          src="/icon_arrow_left.svg"
          alt="back"
          width={18.462}
          height={18.462}
        />
      </div>
      <p className="back-button-text h4-20 color-purple-01">돌아가기</p>
    </button>
  );
}
