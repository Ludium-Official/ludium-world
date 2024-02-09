import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getLearningList(usrId) {
  const getLearningListResponse = await fetchWithRetry(
    `/profile/${usrId}/learning`
  );

  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

export default async function LearningList({ usrId }) {
  const learnings = await getLearningList(usrId);

  return (
    <div className="frame-93-7">
      <div className="frame-57">
        <h1 className="h3-24 color-black">나의 학습</h1>
      </div>
      <div className="frame-34 background-white border-gray-06">
        {learnings.map((learning, index) => (
          <Fragment key={learning.postingId}>
            <div className="frame-136">
              <div className="frame-35">
                <div className="frame-92">
                  <div className="frame-3 background-white border-purple-01">
                    <p className="caption-12 color-purple-01">마감 미설정</p>
                  </div>
                  <Link
                    className="link"
                    href={`/participation/${learning.postingId}`}
                  >
                    <h2 className="h5-18 color-gray-02">{learning.title}</h2>
                  </Link>
                </div>
              </div>
              <div className="frame-101-2">
                <div className="frame-100 background-purple-04">
                  <p className="learning-status color-purple-01">진행중</p>
                </div>
              </div>
            </div>
            {index < learnings.length - 1 ? (
              <div className="line border-gray-05" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
