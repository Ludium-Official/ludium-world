"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import isLogined from "./api";

export default function ProfileErrorPage({ error, reset }) {
  const [logined, setLogined] = useState(true);

  const checkLogined = async () => {
    setLogined(await isLogined());
  };

  useEffect(() => {
    checkLogined();
  }, [error]);

  return (
    <div className="wrapper">
      {logined ? (
        <Fragment>
          <h1 className="h4-20 color-black">회원가입을 해주세요.</h1>
          <Link className="link color-purple-01" href="/sign-up">
            회원가입 하러 가기
          </Link>
        </Fragment>
      ) : (
        <h1 className="h4-20 color-black">로그인을 해주세요</h1>
      )}
    </div>
  );
}
