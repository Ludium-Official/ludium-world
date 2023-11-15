import { useRef } from "react";
import Editor from "../../components/Editor";
import Link from "next/link";
import { useRouter } from "next/router";
import fetchWithRetry from "../../functions/api";

export async function getServerSideProps(context) {
  const getProfileResopnse = await fetchWithRetry(`/profile`, {
    headers: {
      cookie: context.req.headers.cookie
    },
  });

  if (!getProfileResopnse.ok) {
    return {
      props: {
        profile: null
      }
    }
  }

  return {
    props: {
      profile: await getProfileResopnse.json()
    }
  }
}

export default function EditProfile({ profile }) {
  const editorRef = useRef(null);
  const router = useRouter();

  if (!profile) return <h1>사용자 데이터를 불러오지 못했습니다.</h1>


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { editorInstance } = editorRef.current;
    formData.append("self_intro", editorInstance.getMarkdown());

    try {
      const res = await fetchWithRetry(`/profile`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        router.push("/profile");
      }

    } catch (error) {
      console.error(error);
    }
  }

  return <>
    <h1>내 정보 수정하기</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="nick">닉네임</label>
      <input type="text" name="nick" id="nick" placeholder="닉네임을 입력하세요" defaultValue={profile.user.nick} />
      <label htmlFor="phone_number">핸드폰번호</label>
      <input type="number" name="phone_number" id="phone_number" placeholder="'-' 없이 숫자만 입력해주세요." defaultValue={profile.user.phnNmb} />
      <p>자기소개</p>
      <Editor editorRef={editorRef} content={profile.user.selfIntro} />
      <Link href="/profile">취소하기</Link>
      <input type="submit" value="저장하기" />
    </form>
  </>
}