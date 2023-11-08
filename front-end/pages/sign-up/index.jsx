import { useRouter } from "next/router";
import Editor from "../../components/Editor";
import { useRef } from "react";
import fetchWithRetry from "../../functions/api";

export default function SignUP() {
    const router = useRouter();
    const editorRef = useRef(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const { editorInstance } = editorRef.current;
        formData.append("self_intro", editorInstance.getMarkdown());

        try {
            const createUserSignResponse = await fetchWithRetry(`/user/sign-up/google`, {
                method: "POST",
                body: formData,
            })

            if (createUserSignResponse.ok) {
                router.push("/main");
            }

        } catch (error) {

        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="nick">닉네임</label>
            <input type="text" name="nick" id="nick" placeholder="닉네임을 입력하세요" />
            <label htmlFor="phone_number">핸드폰번호</label>
            <input type="number" name="phone_number" id="phone_number" placeholder="'-' 없이 숫자만 입력해주세요." />
            <p>자기소개</p>
            <Editor editorRef={editorRef} />
            <button>취소하기</button>
            <input type="submit" value="저장하기" />
        </form>
    )
}  