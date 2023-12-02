"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Editor from "../../../components/Editor";
import Category from "../../../enums/Category";
import fetchWithRetry from "../../../functions/api";
import articlestyle from "../article.module.css";

export default function NewArticleForm() {
    const router = useRouter();
    const editorRef = useRef(null);

    const handleSaveArticle = async (e) => {
        e.preventDefault();

        const { editorInstance } = editorRef.current;
        const formData = new FormData(e.target);

        formData.append("content", editorInstance.getMarkdown());

        const createMissionResponse = await fetchWithRetry(`/article`, {
            method: "POST",
            body: formData,
        });

        if (createMissionResponse.ok) {
            router.push("/article");
            router.refresh();
        }
    };

    const handleBack = () => {
        router.push("/article");
    }

    return (
        <form
            className={articlestyle["form-wrapper"]}
            onSubmit={handleSaveArticle}
        >
            <div className={articlestyle["form-button-area"]}>
                <button
                    className={articlestyle["form-button"]}
                    type="button"
                    onClick={handleBack}
                >
                    돌아가기
                </button>
                <input
                    className={articlestyle["form-button"]}
                    type="submit"
                    value="저장하기"
                />
            </div>
            <div className={articlestyle["form-header"]}>
                <input
                    className={articlestyle["form-textfield"]}
                    type="text"
                    name="title"
                    id="title"
                    placeholder="제목을 입력해주세요"
                />
                <select className={articlestyle["form-textfield"]}
                    name="category" id="category">
                    <option value={Category.MISSION}>미션</option>
                    <option value={Category.ARTICLE} selected>아티클</option>
                </select>
            </div>
            <div className={articlestyle["form-content-area"]}>
                <Editor editorRef={editorRef} height={"100%"} />
            </div>
        </form>
    );
}