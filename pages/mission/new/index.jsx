import { useRouter } from "next/router";
import { useRef } from "react";
import Editor from "../../../components/Editor";
import Category from "../../../enums/Category";

export default function NewMission() {
    const router = useRouter();
    const editorRef = useRef(null);

    const handleSave = async (e) => {
        e.preventDefault();

        const { editorInstance } = editorRef.current;
        const formData = new FormData(e.target);

        formData.append("content", editorInstance.getMarkdown());

        const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

        const createMissionResponse = await fetch(`${serverUri}/article`, {
            method: "post",
            body: formData,
            credentials: "include"
        });

        if (createMissionResponse.ok) {
            router.push("/mission");
        }
    }

    return (
        <form onSubmit={handleSave}>
            <input type="text" name="title" id="title" placeholder="제목을 입력해주세요" />
            <select name="category" id="category">
                <option value={Category.MISSION}>미션</option>
                <option value={Category.ARTICLE}>아티클</option>
            </select>
            <input type="submit" value="저장하기" />
            <Editor editorRef={editorRef} />
        </form>
    )
}