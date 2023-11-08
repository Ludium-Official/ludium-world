import Link from "next/link";
import Viewer from "../../components/Viewer";
import { useRef } from "react";
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

export default function Profile({ profile }) {
    if (!profile) return <h1>사용자 데이터를 불러오지 못했습니다.</h1>

    const viewerRef = useRef(null);

    return <>
        <h1>내 정보</h1>
        <Link href="/profile/edit">내 정보 수정하기</Link>
        <hr />
        <p>닉네임: {profile.user.nick}</p>
        <p>핸드폰 번호: {profile.user.phnNmb}</p>
        <p>자기소개</p>
        <Viewer viewerRef={viewerRef} content={profile.user.selfIntro}></Viewer>
        <h1>내가 쓴 아티클</h1>
        {profile.articles.map(article =>
            <div key={article.id} style={{ display: "flex", flexDirection: "column", border: "solid 1px", margin: "0 0 10px 0" }}>
                <p>{article.title}</p>
                <p>{article.content}</p>
            </div>
        )}
        <hr />
        <h1>내가 쓴 미션</h1>
        {profile.missions.map(article =>
            <div key={article.id} style={{ display: "flex", flexDirection: "column", border: "solid 1px", margin: "0 0 10px 0" }}>
                <p>{article.title}</p>
                <p>{article.content}</p>
            </div>
        )}
        <hr />
        <h1>내가 쓴 자유게시글</h1>
        {profile.freeBoards.map(article =>
            <div key={article.id} style={{ display: "flex", flexDirection: "column", border: "solid 1px", margin: "0 0 10px 0" }}>
                <p>{article.title}</p>
                <p>{article.content}</p>
            </div>
        )}
        <hr />
        <h1>내가 제출한 미션</h1>
        <hr />
        {profile.submits.map(submit =>
            <div key={submit.id} style={{ display: "flex", flexDirection: "column" }}>
                <span>{submit.content}
                    <p style={{ color: submit.vldStt === true ? "green" : "red" }}>{submit.vldStt === true ? "검증됨" : "검증되지 않음"}</p>
                </span>
            </div>
        )}
        <h1>내 댓글</h1>
        <hr />
        {profile.comments.map(comment =>
            <p key={comment.id} >{comment.content}</p>
        )}
        <h1>내 미션에 달린 댓글</h1>
        <hr />
        {profile.userCommentsByMyMission.map(comment =>
            <p key={comment.id}>{comment.content}</p>
        )}
    </>;
}