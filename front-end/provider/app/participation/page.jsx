import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import UnAuthorizedError from "@/errors/UnAuthorizedError";
import { cookies } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
  title: "웹 3.0 프로젝트 학습 참여",
  description:
    "웹 3.0 기반의 평등한 참여와 학습으로 보상 받는 커뮤니티를 경험하세요.",
  openGraph: {
    title: "웹 3.0 프로젝트 학습 참여",
    description:
      "웹 3.0 기반의 평등한 참여와 학습으로 보상 받는 커뮤니티를 경험하세요.",
    url: process.env.NEXT_PUBLIC_SITE_MAP_URL,
    siteName: "루디움",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "logo1.png",
        width: 70,
        height: 32,
        alt: "루디움",
      },
    ],
  },
};

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

async function LearningList({ participations }) {
  const learnings = await getLearningList();

  return (
    <div className="frame-34">
      <div className="frame-101">
        <div className="frame-9">
          <h2 className="h4-20 color-black">학습 목록</h2>
        </div>
      </div>
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
    </div>
  );
}

export default async function ParticipationListPage() {
  const profile = await getProfile();

  const participations =
    profile === null ? [] : await getParticipationList(profile.id);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <h1 className="h3-24">학습 참여</h1>
          <LearningList participations={participations} />
        </div>
      </article>
    </>
  );
}
