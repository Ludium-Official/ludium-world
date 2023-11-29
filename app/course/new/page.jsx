"use client";

import { useRef, useState } from "react";
import Editor from "../../../components/Editor";
import fetchWithRetry from "../../../functions/api";
import { useRouter } from "next/navigation";
import coursestyle from "../course.module.css";

export default function NewCoursePage() {
    const editorRef = useRef(null);
    const [modules, setModules] = useState([]);
    const router = useRouter();

    const handleSave = async (e) => {
        e.preventDefault();

        const { editorInstance } = editorRef.current;
        const moduleFields = e.target.querySelectorAll(`[name^="module-"]`);

        const modules = Array.from(moduleFields).reduce((acc, moduleField, index) => {
            const value = moduleField.value;

            if(index === 0) {
                return `${value}`;
            }

            return `${acc}|${value}`;
        }, "");

        const formData = new FormData();

        formData.append("title", editorInstance.getMarkdown());
        formData.append("content", editorInstance.getMarkdown());
        formData.append("modules", modules);

        const createCourseResponse = await fetchWithRetry(`/course`, {
            method: "POST",
            body: formData,
        });

        if (createCourseResponse.ok) {
            router.push("/course");
            router.refresh();
        }
    }

    const handleCreateModule = () => {
        setModules([...modules, { title: "" }])
    }

    return <form className={coursestyle["course-edit-wrapper"]} onSubmit={handleSave}>
    <input type="text" name="title" id="title" placeholder="제목을 입력해주세요" />
    <input type="submit" value="저장하기" />
    <div style={{display: "flex", flexDirection: "column"}}>
        <button type="button" onClick={handleCreateModule}>모듈 추가하기</button>
        {modules.map((_, index) =>
            <input key={1} type="text" name={`module-${index}`} id={`module-${index}`} placeholder="모듈 제목을 입력해주세요" />
        )}
    </div>
    <Editor editorRef={editorRef} />
</form>
}