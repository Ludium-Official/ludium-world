import UnAuthorizedError from "@/errors/UnAuthorizedError";
import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";

async function getLearningList() {
  const getLearningListResponse = await fetchWithRetry(`/learning`);

  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 불러오는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

async function getParticipationList(usrId) {
  const getLearningListResponse = await fetchWithRetry(
    `/profile/${usrId}/learning`
  );

  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

export async function getProfile() {
  const cookieStore = cookies();

  try {
    const getProfileResopnse = await fetchWithRetry(`/profile`, {
      headers: {
        cookie: cookieStore,
      },
    });

    if (!getProfileResopnse.ok) return null;

    return await getProfileResopnse.json();
  } catch (error) {
    if (error instanceof UnAuthorizedError) return null;
  }
}

export default async function LearningList() {
  const profile = await getProfile();
  const learnings = await getLearningList();
  const participations =
    profile === null ? [] : await getParticipationList(profile.id);

  return (
    <>
      {learnings.map(({ postingId, title }) => (
        <Fragment key={postingId}>
          <div className="frame-136">
            <div className="frame-35">
              <h3 className="frame-92">
                <div className="frame-3 background-white border-purple-01 ">
                  <p className="caption-12 color-purple-01">수강 마감 미설정</p>
                </div>
                <Link
                  className="h5-18 color-gray-02 link"
                  href={`/participation/${postingId}`}
                >
                  {title}
                </Link>
              </h3>
            </div>
            <div className="frame-102">
              {participations.some(
                (participation) => participation.postingId === postingId
              ) ? (
                <div className="frame-97 background-purple-04 color-purple-01">
                  진행중
                </div>
              ) : (
                <div className="frame-100 background-gray-06 color-gray-04 border-gray-04">
                  미진행
                </div>
              )}
            </div>
          </div>
          <div className="line border-gray-05" />
        </Fragment>
      ))}
    </>
  );
}
