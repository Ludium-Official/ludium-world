import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getLearningList(usrId) {
  const getLearningListResponse = await fetchWithRetry(
    `/profile/${usrId}/learning/top4`
  );

  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

export default async function Learning({ usrId }) {
  const learnings = await getLearningList(usrId);

  return (
    <>
      {learnings.map((learning, index) => (
        <Fragment key={learning.postingId}>
          <div className="frame-35-4">
            <div className="frame-92">
              <div className="frame-3 border-purple-01">
                <p className="caption-12 color-purple-01">마감 미설정</p>
              </div>
              <Link
                className="link"
                href={`/participation/${learning.postingId}`}
              >
                <h2 className="h4-20 color-gray-02">{learning.title}</h2>
                {/* <p className="caption-12 color-gray-02">
                        {learning.title}
                      </p> */}
              </Link>
            </div>
            {/* 학습 달성률 */}
            {/* <div className="frame-85">
                  <div className="frame-9-5">
                    <p className="caption-12 color-black">달성률</p>
                    <p className="p2-16 color-purple-02">100%</p>
                  </div>
                </div> */}
          </div>
          {index < learnings.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
