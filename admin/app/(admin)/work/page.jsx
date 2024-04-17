import Link from "next/link";
import fetchWithRetry from "@/functions/api";
import workstyle from "./work.module.css";

export const metadata = {
  title: "작업 목록",
};

async function getWorkList() {
  const getWorkResponse = await fetchWithRetry("/detailed-announcement");

  if (!getWorkResponse.ok)
    if (getWorkResponse.status === 404) return [];
    else throw new Error("작업 목록을 조회하는 중 에러가 발생했습니다.");

  return await getWorkResponse.json();
}

async function WorkList() {
  const works = await getWorkList();

  return (
    <div className={workstyle["work-list"]}>
      {works.map(({ detailId, title }) => (
        <h2 className={workstyle["work-list-item"]} key={detailId}>
          <Link href={`/work/${detailId}`}>{title}</Link>
        </h2>
      ))}
    </div>
  );
}

export default async function WorkListPage() {
  return (
    <article className={workstyle.wrapper}>
      <h1 className={workstyle["title-label"]}>작업 목록</h1>
      <WorkList />
    </article>
  );
}
