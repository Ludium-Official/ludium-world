import Link from "next/link";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

    const getProfileResopnse = await fetch(`${serverUri}/profile`, {
        headers: {
            cookie: context.req.headers.cookie
        },
        credentials: "include"
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

export default function Profile({ profile }) {
    console.log(profile)
    if (!profile) return <h1>사용자 데이터를 불러오지 못했습니다.</h1>

    return <>
        <p>닉네임: {profile.user.nick}</p>
        <h1>내가 쓴 아티클</h1>
        {profile.articles.map(article => <>
            <div style={{ display: "flex", flexDirection: "column", border: "solid 1px", margin: "0 0 10px 0" }}>
                <p>{article.title}</p>
                <p>{article.content}</p>
            </div>
        </>)}
        <hr />
        <h1>내가 쓴 미션</h1>

        <hr />
        <h1>내가 쓴 자유게시글</h1>

        <hr />
        <h1>내가 제출한 미션</h1>
        <hr />
        {profile.submits.map(submit => <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <p>{submit.content}</p>
            </div>
        </>)}
        <h1>내 댓글</h1>
        <hr />
        {profile.comments.map(comment => <>
            <p>{comment.content}</p>
        </>)}
    </>;
}