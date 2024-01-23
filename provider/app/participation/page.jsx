import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import Link from "next/link";

export const metadata = {
  title: "학습 참여",
};

async function getLearningList() {
  const getLearningListResponse = await fetchWithRetry(`/learning`);

  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 불러오는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

async function LearningList() {
  const learnings = await getLearningList();

  return (
    <div className="list">
      {learnings.map(({ postingId, title }) => (
        <h2 className="list-item" key={postingId}>
          <Link className="list-item-link" href={`/participation/${postingId}`}>
            {title}
          </Link>
        </h2>
      ))}
    </div>
  );
}

export default async function ParticipationListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <h1 className="header1">학습 목록</h1>
        <LearningList />
      </article>
    </>
  );
}
