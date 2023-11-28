import { cookies } from "next/headers";
import ContentNavigation from "../../components/ContentNavigation";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";
import profilestyle from "./profile.module.css";
import Link from "next/link";

export const metadata = {
  title: "프로필"
}

export async function getProfile() {
  const cookieStore = cookies();

  const getProfileResopnse = await fetchWithRetry(`/profile`, {
    headers: {
      cookie: cookieStore,
    },
  });

  if (!getProfileResopnse.ok) return null;

  return await getProfileResopnse.json();
}

export default async function ProfilePage() {
  const profile = await getProfile();
  const links = [
    {
      href: "/profile/edit",
      text: "내 정보 수정하기",
    },
  ];

  return (
    <>
      <div className={profilestyle["content-navigation"]}>
        <ContentNavigation links={links} />
      </div>
      <div className={profilestyle["profile-wrapper"]}>
        <h1 className={profilestyle["profile-title"]}>내 정보</h1>
        <article className={profilestyle["profile-info"]}>
          <p>닉네임: {profile.user.nick}</p>
          <p>핸드폰 번호: {profile.user.phnNmb}</p>
          <p>자기소개</p>
          <div className={profilestyle["profile-self-intro-wrapper"]}>
            <Viewer content={profile.user.selfIntro} />
          </div>
        </article>
        <h2
          className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]} ${profilestyle["profile-title-active"]}`}
        >
          <Link href="/profile?active=article">내가 쓴 아티클</Link>
        </h2>
        <article className={`${profilestyle["profile-content"]}`}>
          {profile.articles.map((article) => (
            <div
              key={article.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "solid 1px",
                margin: "0 0 10px 0",
              }}
            >
              <p>{article.title}</p>
              <p>{article.content}</p>
            </div>
          ))}
        </article>
        <h2
          className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]}`}
        >
          <Link href="/profile?active=mission">미션</Link>
        </h2>
        <article className={`${profilestyle["profile-content"]}`}>
          {profile.missions.map((article) => (
            <div
              key={article.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "solid 1px",
                margin: "0 0 10px 0",
              }}
            >
              <p>{article.title}</p>
              <p>{article.content}</p>
            </div>
          ))}
        </article>
        <h2
          className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]}`}
        >
          <Link href="/profile?active=free_board">자유게시글</Link>
        </h2>
        <article className={`${profilestyle["profile-content"]}`}>
          {profile.freeBoards.map((article) => (
            <div
              key={article.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "solid 1px",
                margin: "0 0 10px 0",
              }}
            >
              <p>{article.title}</p>
              <p>{article.content}</p>
            </div>
          ))}
        </article>
        <h2
          className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]}`}
        >
          <Link href="/profile?active=submit_mission">제출한 미션</Link>
        </h2>
        <article className={`${profilestyle["profile-content"]}`}>
          {profile.submits.map((submit) => (
            <div
              key={submit.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <span>
                {submit.content}
                <p style={{ color: submit.vldStt === true ? "green" : "red" }}>
                  {submit.vldStt === true ? "검증됨" : "검증되지 않음"}
                </p>
              </span>
            </div>
          ))}
        </article>
        <h2
          className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]}`}
        >
          <Link href="/profile?active=comments">댓글</Link>
        </h2>
        <article className={`${profilestyle["profile-content"]}`}>
          {profile.comments.map((comment) => (
            <p key={comment.id}>{comment.content}</p>
          ))}
        </article>
        <h2
          className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]}`}
        >
          <Link href="/profile?active=replay_comments">
            내 미션에 달린 댓글
          </Link>
        </h2>
        <article className={`${profilestyle["profile-content"]}`}>
          {profile.userCommentsByMyMission.map((comment) => (
            <p key={comment.id}>{comment.content}</p>
          ))}
        </article>
      </div>
    </>
  );
}
