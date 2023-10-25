import { useRouter } from "next/router";

export default function SignUP() {
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { value } = await cookieStore.get("access_token");

        try {
            const res = await fetch("http://localhost:8080/user/sign-up/google", {
                method: "post",
                body: formData,
                headers: {
                    Authorization: `Bearer${value}`
                }
            })

            if(res.ok) {
                router.push("/main");
            }
            
        } catch (error) {
            
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="nick">닉네임</label>
            <input type="text" name="nick" id="nick" placeholder="닉네임을 입력하세요" />
            <label htmlFor="self_intro">자기소개</label>
            <textarea name="self_intro" id="self_intro" cols="30" rows="10" placeholder="자기소개를 입력하세요"></textarea>
            <label htmlFor="phone_number">핸드폰번호</label>
            <input type="number" name="phone_number" id="phone_number" placeholder="휴대폰번호를 입력해주세요" />
            <button>취소하기</button>
            <input type="submit" value="저장하기" />
        </form>
    )
}  