"use client";

import { useRef } from "react";
import Editor from "../../components/Editor";
import applystyle from "./apply.module.css";
import fetchWithRetry from "../../functions/api";
import { useRouter } from "next/navigation";

export default function ApplyForm({ apply }) {
    const {id, content} = apply === null ? {id: null, content: "" } : apply;
    const router = useRouter();

    const editorRef = useRef();
    const handleApplyForm = async (e) => {
        e.preventDefault();
        const { editorInstance } = editorRef.current;

        const applyForm = new FormData(e.target);
        applyForm.append("content", editorInstance.getMarkdown());

        if(id === null) {
            const createApplyResponse = await fetchWithRetry(`/apply`, {
                method: "POST",
                body: applyForm
            });

            if(createApplyResponse.ok) alert("신청서 작성이 완료되었습니다.");
            router.refresh();
        } else {
            const updateApplyResponse = await fetchWithRetry(`/apply/${id}`, {
                method: "PUT",
                body: applyForm
            })

            if(updateApplyResponse.ok) alert("신청서 변경이 완료되었습니다.");
            router.refresh();
        }
    }

    return <form className={applystyle.form} onSubmit={handleApplyForm} >
        <div className={applystyle["form-header"]}>
            <button >저장하기</button>
        </div>
        <input type="hidden" name="title" defaultValue="신청서" />
        <Editor editorRef={editorRef} height="100%" content={content} />
    </form>
}