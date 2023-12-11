"use client";

import { useRef } from "react";
import Editor from "../../../components/Editor";
import applystyle from "./apply.module.css";
import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";

export default function ApplyForm({ apply }) {
    const { id, content } = apply;
    const router = useRouter();

    const editorRef = useRef();
    const handleApplyForm = async (e) => {
        e.preventDefault();
        const { editorInstance } = editorRef.current;

        const applyForm = new FormData(e.target);
        applyForm.append("content", editorInstance.getMarkdown());

        if (id === null) {
            const createApplyResponse = await fetchWithRetry(`/apply/provider`, {
                method: "POST",
                body: applyForm
            });

            if (createApplyResponse.ok) alert("지원서 작성이 완료되었습니다.");
            router.back();
            router.refresh();
        } else {
            const updateApplyResponse = await fetchWithRetry(`/apply/provider/${id}`, {
                method: "PUT",
                body: applyForm
            })

            if (updateApplyResponse.ok) alert("지원서 변경이 완료되었습니다.");
            router.back();
            router.refresh();
        }
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
        <input type="hidden" name="title" defaultValue="지원서" />
        <div className={applystyle["content-area"]}>
            <Editor editorRef={editorRef} height="100%" content={content} />
        </div>
    </form>
}