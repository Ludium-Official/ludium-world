"use client";

import { useRef } from "react";
import Editor from "../../components/Editor";
import applystyle from "./apply.module.css";
import fetchWithRetry from "../../functions/api";

export default function ApplyForm({ apply }) {
    const {id, content} = apply === null ? {id: null, content: "" } : apply;

    const editorRef = useRef();
    const handleApplyForm = async (e) => {
        e.preventDefault();
        const { editorInstance } = editorRef.current;

        const applyForm = new FormData(e.target);
        applyForm.append("content", editorInstance.getMarkdown());

        if(id === null) {
            const createModuleWithArticle = await fetchWithRetry(`/apply`, {
                method: "POST",
                body: applyForm
            });
        } else {
            await fetchWithRetry(`/apply/${id}`, {
                method: "PUT",
                body: applyForm
            })
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