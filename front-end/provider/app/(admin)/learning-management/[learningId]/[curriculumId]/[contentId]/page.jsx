import BackButton from "@/components/BackButton";
import Category from "@/enums/Category";
import MissionEditor from "./MissionEditor";
import ArticleEditor from "../../ArticleEditor";
import fetchWithRetry from "@/functions/api";

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

async function Mission({ learningId, curriculumId, contentId }) {
  const mission = await getMission(learningId, curriculumId, contentId);

  return <MissionEditor postingId={learningId} mission={mission} />;
}

async function Article({ learningId, curriculumId, contentId }) {
  const article = await getArticle(learningId, curriculumId, contentId);
  return <ArticleEditor postingId={learningId} article={article} />;
}

export default async function LearningContentPage({
  params: { learningId, curriculumId, contentId },
  searchParams: { type },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">
              {type === Category.MISSION ? "미션" : "아티클"} 수정
            </h3>
          </div>
        </div>
        <section className="frame-34-4">
          <div className="frame-117">
            {type === Category.MISSION ? (
              <Mission
                learningId={learningId}
                curriculumId={curriculumId}
                contentId={contentId}
              />
            ) : (
              <Article
                learningId={learningId}
                curriculumId={curriculumId}
                contentId={contentId}
              />
            )}
          </div>
        </section>
      </article>
    </>
  );
}
