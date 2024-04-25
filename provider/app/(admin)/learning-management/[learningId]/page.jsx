import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";
import CreateArticleButton from "./CreateArticlebutton";
import CreateCurriculumButton from "./CreateCurriculumButton";
import CreateMissionButton from "./CreateMissionButton";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export async function generateMetadata({ params: { learningId } }) {
  const learning = await getLearning(learningId);
  return {
    title: learning.title,
  };
}

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

async function getMission(learningId, curriculumId, missionId) {
  const getMissionResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission/${missionId}`
  );

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function getArticle(learningId, curriculumId, articleId) {
  const getArticleResponse = await fetchWithRetry(`/article/${articleId}`);

  if (!getArticleResponse.ok)
    throw new Error("아티클을 조회하는 중 에러가 발생했습니다.");

  return await getArticleResponse.json();
}

async function getContentList(learningId, curriculumId) {
  const getContentListResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/content`
  );

  if (!getContentListResponse.ok)
    if (getContentListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getContentListResponse.json();
}

async function Article({ learningId, curriculumId, articleId }) {
  const { title } = await getArticle(learningId, curriculumId, articleId);

  return (
    <h4 className="h4-20 color-gray">
      [아티클] {title === "" ? "제목을 입력해주세요" : title}
    </h4>
  );
}

async function Mission({ learningId, curriculumId, missionId }) {
  const { title } = await getMission(learningId, curriculumId, missionId);

  return (
    <h4 className="h4-20 color-gray">
      [미션] {title === "" ? "제목을 입력해주세요" : title}
    </h4>
  );
}

async function ContentList({ learningId, curriculumId }) {
  const contents = await getContentList(learningId, curriculumId);

  return (
    <div className="frame-119">
      {contents.map(({ id, type }, index) => (
        <Fragment key={id}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <Link
                  className="link"
                  href={`/learning-management/${learningId}/${curriculumId}/${id}?type=${type}`}
                >
                  {type === "MISSION" ? (
                    <Mission
                      learningId={learningId}
                      curriculumId={curriculumId}
                      missionId={id}
                    />
                  ) : (
                    <Article
                      learningId={learningId}
                      curriculumId={curriculumId}
                      articleId={id}
                    />
                  )}
                </Link>
                <hr />
              </div>
            </div>
          </div>
          {index < contents.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

async function CurriculumList({ learningId }) {
  const curriculums = await getCurriculumList(learningId);

  return (
    <div className="frame-119">
      {curriculums.map(({ curriculumId, title, orderNum }, index) => (
        <Fragment key={curriculumId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <Link
                  className="link"
                  href={`/learning-management/${learningId}/${curriculumId}`}
                >
                  <h4 className="h4-20 color-gray-02">
                    {title === "" ? "제목을 입력해주세요" : title}
                  </h4>
                </Link>
                <p>(순서: {orderNum ?? "미지정"})</p>
              </div>
              <div className="margin1" />
              <div className="frame border-gray-06">
                <div className="frame-101">
                  <div className="frame-9">
                    <h4 className="h4-20 color-black">미션 & 아티클 목록</h4>
                    <div className="flex-end">
                      <CreateMissionButton
                        learningId={learningId}
                        curriculumId={curriculumId}
                      />
                      <div className="margin1" />
                      <CreateArticleButton
                        learningId={learningId}
                        curriculumId={curriculumId}
                      />
                    </div>
                  </div>
                </div>
                <ContentList
                  learningId={learningId}
                  curriculumId={curriculumId}
                />
              </div>
            </div>
          </div>
          {index < curriculums.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

async function LearningContent({ learningId }) {
  const { title, description } = await getLearning(learningId);

  return (
    <section className="frame background-white border-gray-06">
      <div className="frame-101">
        <div className="frame-9">
          <h4 className="h4-20 color-black">{title}</h4>
        </div>
      </div>
      <div className="line border-gray-05" />
      <div className="frame-120">
        <Viewer content={description} height="100%" />
      </div>
    </section>
  );
}

export default async function LearningPage({ params: { learningId } }) {
  return (
    <>
      <header className="nb">
        <BackButton />
        <Link
          className="frame-56 background-white border-none link"
          href={`/learning-management/${learningId}/edit`}
        >
          <Icon
            src="/icon_write.svg"
            alt="학습 수정하기"
            width={24}
            height={24}
          />
          <p className="h4-20 color-purple-01">수정하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">학습</h3>
            <Link href={`/learning-management/${learningId}/monitor`}>
              현황 보기
            </Link>
          </div>
          <LearningContent learningId={learningId} />
          <section className="frame background-white border-gray-06">
            <div className="frame-101">
              <div className="frame-9">
                <h4 className="h4-20 color-black">커리큘럼 목록</h4>
                <CreateCurriculumButton learningId={learningId} />
              </div>
            </div>
            <CurriculumList learningId={learningId} />
          </section>
        </div>
      </article>
    </>
  );
}
