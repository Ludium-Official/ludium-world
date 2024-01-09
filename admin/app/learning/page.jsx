import ContentNavigation from "@/components/ContentNavigation";
import learningstyle from "./learning.module.css";
import fetchWithRetry from "@/functions/api";
import Link from "next/link";

export const metadata = {
  title: "학습제작",
};

async function getLearningList() {
  const getLearningListResponse = await fetchWithRetry(`/learning`);

  console.log(getLearningListResponse.status);
  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 불러오는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

async function LearningList() {
  const learnings = await getLearningList();

  return (
    <div className={learningstyle["learning-list"]}>
      {learnings.map((learning) => (
        <h2
          className={learningstyle["learning-list-item"]}
          key={learning.postingId}
        >
          <Link href={`/learning/${learning.postingId}`}>{learning.title}</Link>
        </h2>
      ))}
    </div>
  );
}

export default async function LearningListPage() {
  const links = [
    {
      href: "/learning/new",
      text: "학습 만들기",
    },
  ];

  return (
    <>
      <div className={learningstyle["new-button-area"]}>
        <ContentNavigation links={links} />
      </div>
      <article className={learningstyle.wrapper}>
        <h1 className={learningstyle["title-label"]}>학습 목록</h1>
        <LearningList />
      </article>
    </>
  );
}
