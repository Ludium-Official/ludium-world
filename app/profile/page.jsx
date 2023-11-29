import { cookies } from "next/headers";
import Link from "next/link";
import ContentNavigation from "../../components/ContentNavigation";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";
import profilestyle from "./profile.module.css";

export const metadata = {
  title: "프로필"
}

function Articles({ articles }) {
  return <article className={`${profilestyle["profile-content"]}`}>
    {articles.map((article) => (
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
}

function Missions({ missions }) {
  return <article className={`${profilestyle["profile-content"]}`}>
    {missions.map((article) => (
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
}

function FreeBoards({ freeBoards }) {
  return <article className={`${profilestyle["profile-content"]}`}>
    {freeBoards.map((article) => (
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
}

function Submits({ submits }) {
  return <article className={`${profilestyle["profile-content"]}`}>
    {submits.map((submit) => (
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
}

function Comments({ comments }) {
  return <article className={`${profilestyle["profile-content"]}`}>
    {comments.map((comment) => (
      <p key={comment.id}>{comment.content}</p>
    ))}
  </article>
}

function Replies({ replies }) {
  return <article className={`${profilestyle["profile-content"]}`}>
    {replies.map((comment) => (
      <p key={comment.id}>{comment.content}</p>
    ))}
  </article>
}

function Tabs({ active }) {
  const links = [{
    href: "article",
    text: "아티클"
  }, {
    href: "mission",
    text: "미션"
  }, {
    href: "free_board",
    text: "자유 게시글"
  }, {
    href: "submit_mission",
    text: "제출한 미션"
  }, {
    href: "comments",
    text: "댓글",
  }, {
    href: "reply_comments",
    text: "내 미션에 달린 댓글"
  }];

  return <>
    {links.map(({href, text}) => 
      <h2 className={`${profilestyle["profile-title"]} ${profilestyle["profile-title-tab"]} ${active === href ? profilestyle["profile-title-tab-active"]: ""}`}>
        <Link href={`/profile?active=${href}`}>{text}</Link>
      </h2>
    )}
  </>
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

export default async function ProfilePage({ searchParams: { active } }) {
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
        <Tabs active={active} />
        {
          active === "article" ? <Articles articles={profile.articles} /> :
            active === "mission" ? <Missions missions={profile.missions} /> :
              active === "free_board" ? <FreeBoards freeBoards={profile.freeBoards} /> :
                active === "submit_mission" ? <Submits submits={profile.submits} /> :
                  active === "comments" ? <Comments comments={profile.comments} /> :
                    active === "reply_comments" ? <Replies replies={profile.userCommentsByMyMission} /> :
                      <Articles articles={profile.articles} />
        }
      </div>
    </>
  );
}
