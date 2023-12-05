"use client";

import profilestyle from "../profile.module.css";

export default function ProfileErrorPage({
    error,
    reset,
}) {
    return <div className={profilestyle["profile-wrapper"]}>
        <h1>로그인을 먼저 해주세요.</h1>
    </div>
}