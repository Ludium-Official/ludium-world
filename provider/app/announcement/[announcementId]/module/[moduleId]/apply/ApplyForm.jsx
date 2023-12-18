"use client";

import { useRef } from "react";
import applystyle from "./apply.module.css";
import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../../../../functions/api";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../../../../../components/Editor"), { ssr: false });

export default function ApplyForm({ apply }) {
    const { id, content } = apply;
    const router = useRouter();

    const editorRef = useRef();
    const handleApplyForm = async (e) => {
        e.preventDefault();
        const { editorInstance } = editorRef.current;

        const applyForm = new FormData(e.target);
        applyForm.append("content", editorInstance.getMarkdown());

        // if (id === null) {
        const createApplyResponse = await fetchWithRetry(`/apply/${id}`, {
            method: "POST",
            body: applyForm
        });

        if (createApplyResponse.ok) alert("지원서 작성이 완료되었습니다.");
        router.back();
        router.refresh();
    }

    const handleBack = () => {
        router.back();
    }

    return <form className={applystyle.form} onSubmit={handleApplyForm} >
        <div className={applystyle["form-button-area"]}>
            <button
                className={applystyle["form-button"]}
                type="button"
                onClick={handleBack}
            >
                돌아가기
            </button>
            <input
                className={applystyle["form-button"]}
                type="submit"
                value="지원서 제출하기" />
        </div>
        <div className={applystyle["form-header"]}>
            <input className={applystyle["form-title"]} type="text" name="title" defaultValue={apply.title} readOnly />
        </div>
        <div className={applystyle["content-area"]}>
            <Editor editorRef={editorRef} height="100%" content={content} />
        </div>
    </form>
}