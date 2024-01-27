import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import ArticleSubmitbutton from "../../../ArticleSubmitButton";
import ARTICLESUBMIT_STATUS from "@/enums/ARTICLESUBMIT_STATUS";
import UnAuthorizedError from "errors/UnAuthorizedError";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getArticle(articleId) {
  const getArticleResponse = await fetchWithRetry(`/article/${articleId}`);

  if (!getArticleResponse.ok)
    throw new Error("아티클을 조회하는 중 에러가 발생했습니다.");

  return await getArticleResponse.json();
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
      if (getArticleSubmitResponse.status === 404)
        return {
          visible: true,
          data: null,
        };
      else throw new Error("아티클 제출을 조회하는 중 에러가 발생했습니다.");

    return {
      visible: true,
      data: await getArticleSubmitResponse.json(),
    };
  } catch (error) {
    if (error instanceof UnAuthorizedError)
      return { visible: false, data: null };
    else throw new Error(error.message);
  }
}

async function Article({ learningId, curriculumId, article }) {
  const articleSubmit = await getArticleSubmit(
    learningId,
    curriculumId,
    article.articleId
  );

  const articleSubmitStatus =
    articleSubmit.data === null
      ? ARTICLESUBMIT_STATUS.NO_COMPLETE
      : ARTICLESUBMIT_STATUS[articleSubmit.data.status];

  return (
    <>
      <h1 className="header1 space-between">
        <span>{article.title}</span>
        <span>{articleSubmitStatus}</span>
      </h1>
      <div className="viewer-content">
        <Viewer content={article.description} height="100%" />
      </div>
      {articleSubmit.visible === true ? (
        <div className="center">
          <ArticleSubmitbutton
            learningId={learningId}
            curriculumId={curriculumId}
            articleId={article.articleId}
          />
        </div>
      ) : null}
    </>
  );
}

export default async function ArticlePage({
  params: { participationId, curriculmId, articleId },
}) {
  const article = await getArticle(articleId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <Article
          learningId={participationId}
          curriculumId={curriculmId}
          article={article}
        />
      </article>
    </>
  );
}
