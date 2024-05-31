"use client";

import BackButton from "@/components/BackButton";

export default function ApplicationErrorPage({ error }) {
  return (
    <>
      <header className="nb">
        <BackButton />
        <article className="wrapper">
          <h3 className="h3-24 color-black">
            작업자 지원서 양식이 없습니다. 지원서 양식을 만들어주세요.
          </h3>
        </article>
      </header>
    </>
  );
}
