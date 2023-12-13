"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import fetchWithRetry from "../../../../functions/api";
import applystyle from "../../apply.module.css";
import BackButton from "../../../../components/BackButton";

const Editor = dynamic(() => import("../../../../components/Editor"), { ssr: false });

export default function EditApplyForm({ apply: { id, title, content } }) {
    const router = useRouter();

    const editorRef = useRef();
    const handleApplyForm = async (e) => {
        e.preventDefault();
        const { editorInstance } = editorRef.current;

        const applyForm = new FormData(e.target);
        applyForm.append("content", editorInstance.getMarkdown());

        await fetchWithRetry(`/apply/${id}`, {
            method: "PUT",
            body: applyForm
        });

        router.back();
        router.refresh();
    }

    return <form className={applystyle.form} onSubmit={handleApplyForm} >
        <div className={applystyle["form-button-area"]}>
            <BackButton className={applystyle["form-button"]} />
            <button className={applystyle["form-button"]}>저장하기</button>
        </div>
        <div className={applystyle["form-header"]}>
            <input className={applystyle.title} type="text" name="title" defaultValue={title} placeholder="지원서 제목을 입력해주세요" />
        </div>
        <div className={applystyle["form-content-area"]}>
            <Editor editorRef={editorRef} height="100%" content={content} />
        </div>
    </form>
}