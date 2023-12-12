"use client";

import { useRef } from "react";
import applystyle from "./apply.module.css";
import fetchWithRetry from "../../functions/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

export default function ApplyForm({ apply }) {
    const { id, content } = apply === null ? { id: null, content: "" } : apply;
    const router = useRouter();

    const editorRef = useRef();
    const handleApplyForm = async (e) => {
        e.preventDefault();
        const { editorInstance } = editorRef.current;

        const applyForm = new FormData(e.target);
        applyForm.append("content", editorInstance.getMarkdown());

        if (id === null) {
            const createApplyResponse = await fetchWithRetry(`/apply`, {
                method: "POST",
                body: applyForm
            });

            if (createApplyResponse.ok) alert("지원서 작성이 완료되었습니다.");
            router.refresh();
        } else {
            const updateApplyResponse = await fetchWithRetry(`/apply/${id}`, {
                method: "PUT",
                body: applyForm
            })

            if (updateApplyResponse.ok) alert("지원서 변경이 완료되었습니다.");
            router.refresh();
        }
    }

    const handleRedirectProviderApply = () => {
        router.push("/apply/provider");
        router.refresh();
    }

    return <form className={applystyle.form} onSubmit={handleApplyForm} >
        <div className={applystyle["form-header"]}>
            <button className={applystyle["form-button"]} type="button" onClick={handleRedirectProviderApply}>제작지 지원서 보기</button>
            <button className={applystyle["form-button"]}>저장하기</button>
        </div>
        <input type="hidden" name="title" defaultValue="지원서" />
        <Editor editorRef={editorRef} height="100%" content={content} />
    </form>
}