import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getTop5Participation() {
  const getTop5ParticipationResponse = await fetchWithRetry("/learning/top5");

  if (!getTop5ParticipationResponse.ok)
    if (getTop5ParticipationResponse.status === 404) return [];
    else throw new Error("학습 목록을 조회하는 중 에러가 발생했습니다.");

  return await getTop5ParticipationResponse.json();
}

export default async function Top5ParticipationList() {
  const participations = await getTop5Participation();

  return (
    <>
      {participations.map((participation, index) => (
        <Fragment key={participation.postingId}>
          <li className="article">
            {/* <div className="article-status">
                <p className="article-status-text caption-12 color-purple-01">
                  수강기한 N일
                </p>
              </div> */}
            <Link
              className="article-text h4-20"
              href={`/participation/${participation.postingId}`}
            >
              {participation.title}
            </Link>
          </li>
          {index < participations.length - 1 ? (
            <hr className="article-divider" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
