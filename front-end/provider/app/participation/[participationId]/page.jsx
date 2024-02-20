import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import UnAuthorizedError from "@/errors/UnAuthorizedError";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";

export async function generateMetadata({ params: { participationId } }) {
  const learning = await getLearning(participationId);

  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
    title: learning.title,
    description: learning.description,
    openGraph: {
      title: learning.title,
      description: learning.description,
      url: `${process.env.NEXT_PUBLIC_SITE_MAP_URL}/participation/${participationId}`,
      siteName: "루디움",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "/logo1.svg",
          width: 70,
          height: 32,
          alt: "루디움",
        },
      ],
    },
  };
}

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getLearning(learningId) {
  const getLearningResponse = await fetchWithRetry(`/learning/${learningId}`);

  if (!getLearningResponse.ok)
    throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningResponse.json();
}

async function getCurriculumList(learningId) {
  const getCurriculumListResponse = await fetchWithRetry(
    `/learning/${learningId}/curriculum`
  );

  if (!getCurriculumListResponse.ok)
    if (getCurriculumListResponse.status === 404) return [];
    else throw new Error("커리큘럼을 조회하는 중 에러가 발생했습니다.");

  return await getCurriculumListResponse.json();
}

async function getMissionList(learningId, curriculumId) {
  const getMissionListResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/content`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션, 아티클을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

async function getMissinoSubmit(learningId, curriculumId, missionId) {
  const cookieStore = cookies();

  try {
    const getMissionSubmitResponse = await fetchWithRetry(
      `/learning/${learningId}/${curriculumId}/mission/${missionId}/submit/user`,
      {
        headers: {
          cookie: cookieStore,
        },
      }
    );

    if (!getMissionSubmitResponse.ok)
      if (getMissionSubmitResponse.status === 404) return null;
      else throw new Error("미션 제출을 조회하는 중 에러가 발생했습니다.");

    return await getMissionSubmitResponse.json();
  } catch (error) {
    if (error instanceof UnAuthorizedError) return null;
    else throw new Error(error.message);
  }
}

async function getArticleSubmit(learningId, curriculumId, articleId) {
  const cookieStore = cookies();

  try {
    const getArticleSubmitResponse = await fetchWithRetry(
      `/learning/${learningId}/${curriculumId}/article/${articleId}/submit/user`,
      {
        headers: {
          cookie: cookieStore,
        },
      }
    );

    if (!getArticleSubmitResponse.ok)
      if (getArticleSubmitResponse.status === 404) return null;
      else throw new Error("아티클 제출을 조회하는 중 에러가 발생했습니다.");

    return await getArticleSubmitResponse.json();
  } catch (error) {
    if (error instanceof UnAuthorizedError) return null;
    else throw new Error(error.message);
  }
}

async function MissionSubmit({ learningId, curriculumId, missionId }) {
  const missionSubmit = await getMissinoSubmit(
    learningId,
    curriculumId,
    missionId
  );

  if (missionSubmit === null)
    return (
      <div className="frame-97 background-gray-06 color-gray-04 border-gray-04">
        {ko_kr.NO_COMPLETE}
      </div>
    );
  if (missionSubmit.status === "SUBMIT")
    return (
      <div className="frame-97 background-purple-04 color-purple-01">
        {ko_kr[missionSubmit.status]}
      </div>
    );

  return (
    <div className="frame-97 background-purple-01 color-white">
      {ko_kr[missionSubmit.status]}
    </div>
  );
}

async function ArticleSubmit({ learningId, curriculumId, articleId }) {
  const articleSubmit = await getArticleSubmit(
    learningId,
    curriculumId,
    articleId
  );

  if (articleSubmit === null)
    return (
      <div className="frame-97 background-gray-06 color-gray-04 border-gray-04">
        {ko_kr.NO_COMPLETE}
      </div>
    );
  return (
    <div className="frame-97 background-purple-01 color-white">
      {ko_kr[articleSubmit.status]}
    </div>
  );
}

async function CurriculumContentList({ learningId, curriculumId }) {
  const contents = await getMissionList(learningId, curriculumId);

  if (contents.length === 0) return null;

  return (
    <>
      {contents.map((content) => (
        <section className="frame-118" key={content.id}>
          <div className="frame-34-3">
            <div className="frame-9-2">
              <div className="frame-93-2">
                <h4 className="h4-20">
                  {content.type === "MISSION" ? "미션" : "아티클"}
                </h4>
              </div>
            </div>
          </div>
          <div className="frame-100-2">
            <div className="frame-93-3">
              <div className="frame-4 background-white border-purple-01">
                <p className="caption-12 color-purple-01">수강 마감 미설정</p>
              </div>
              <Link
                className="h4-20 link"
                href={
                  content.type === "MISSION"
                    ? `/participation/${learningId}/${curriculumId}/mission/${content.id}`
                    : `/participation/${learningId}/${curriculumId}/article/${content.id}`
                }
              >
                {content.title}
              </Link>
            </div>
          </div>
          <div className="frame-101-2">
            {content.type === "MISSION" ? (
              <MissionSubmit
                learningId={learningId}
                curriculumId={curriculumId}
                missionId={content.id}
              />
            ) : (
              <ArticleSubmit
                learningId={learningId}
                curriculumId={curriculumId}
                articleId={content.id}
              />
            )}
          </div>
        </section>
      ))}
    </>
  );
}

async function CurriculumList({ learningId }) {
  const curriculums = await getCurriculumList(learningId);

  if (curriculums.length === 0) return null;

  return (
    <article className="frame">
      <div className="frame-101">
        <div className="frame-9">
          <h2 className="h4-20 color-black">커리큘럼 목록</h2>
        </div>
      </div>
      <div className="line border-gray-05" />
      {curriculums.map((curriculum) => (
        <Fragment key={curriculum.curriculumId}>
          <div className="frame-119">
            <div className="frame-123">
              <div className="frame-34-2">
                <div className="frame-9-2">
                  <div className="frame-93-2">
                    <h3 className="h4-20 color-purple-01">
                      {curriculum.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="line border-gray-02" />
          <CurriculumContentList
            learningId={learningId}
            curriculumId={curriculum.curriculumId}
          />
        </Fragment>
      ))}
    </article>
  );
}

async function LearningContent({ learningId }) {
  const learning = await getLearning(learningId);

  return (
    <div className="wrapper">
      <div className="frame-93">
        <div className="frame-57">
          <h1 className="h3-24 color-black">학습</h1>
        </div>
        <article className="frame background-white border-gray-06">
          <div className="frame-101">
            <div className="frame-9">
              <h2 className="h4-20 color-black">{learning.title}</h2>
            </div>
          </div>
          <div className="line border-gray-05" />
          <section className="frame-120">
            <Viewer content={learning.description} height="100%" />
          </section>
        </article>
        <CurriculumList learningId={learningId} />
      </div>
    </div>
  );
}

export default async function ParticipationPage({
  params: { participationId },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <LearningContent learningId={participationId} />
    </>
  );
}
