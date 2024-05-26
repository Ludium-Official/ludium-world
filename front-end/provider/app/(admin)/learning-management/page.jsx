import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

export const metadata = {
  title: "학습 관리",
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
    <div className="frame-119">
      {learnings.map(({ postingId, title }, index) => (
        <Fragment key={postingId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <Link
                  className="link"
                  href={`/learning-management/${postingId}`}
                >
                  <h4 className="h4-20 color-gray-02">{title}</h4>
                </Link>
              </div>
            </div>
          </div>
          {index < learnings.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export default async function LearningListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
        <Link
          className="frame-56 background-white border-none link"
          href="/learning-management/new"
        >
          <Icon
            src="/icon_plus.svg"
            alt="학습 추가하기"
            width={24}
            height={24}
          />
          <p className="h4-20 color-purple-01">추가하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <div className="frame-93-7">
          <div className="frame-57">
            <h3 className="h3-24 color-black">학습 목록</h3>
          </div>
          <div className="frame-34">
            <LearningList />
          </div>
        </div>
      </article>
    </>
  );
}
