import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import UnAuthorizedError from "@/errors/UnAuthorizedError";
import fetchWithRetry from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import ArticleSubmitbutton from "../../../ArticleSubmitButton";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export async function generateMetadata({
  params: { participationId, curriculmId, articleId },
}) {
  const article = await getArticle(articleId);

  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
    title: article.title,
    description: article.description
      .replace(/\[.*?\]\([^)]*?\)/g, "")
      .replace(/\n+/g, "")
      .replace(/#+\s/g, "")
      .replaceAll("*", "")
      .substring(0, 80),
    openGraph: {
      title: article.title,
      description: article.description
        .replace(/\[.*?\]\([^)]*?\)/g, "")
        .replace(/\n+/g, "")
        .replace(/#+\s/g, "")
        .replaceAll("*", "")
        .substring(0, 80),
      url: `${process.env.NEXT_PUBLIC_SITE_MAP_URL}/participation/${participationId}/${curriculmId}/article/${articleId}`,
      siteName: "루디움",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "/logo1.png",
          width: 70,
          height: 32,
          alt: "루디움",
        },
      ],
    },
  };
}

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

  return (
    <section className="frame-151">
      <div className="frame-149">
        <div className="frame background-white border-gray-06">
          <div className="frame-101">
            <div className="frame-9">
              <div className="frame-145">
                <Icon
                  src="/icon_note.svg"
                  alt="아티클"
                  width={24}
                  height={24}
                />
                <h1 className="h4-20">{article.title}</h1>
              </div>
              <div className="frame-9-3">
                <p
                  className={`caption-12 ${
                    articleSubmit.data === null
                      ? "color-gray-04"
                      : "color-purple-01"
                  }`}
                >
                  {articleSubmit.data === null
                    ? ko_kr.NO_COMPLETE
                    : ko_kr[articleSubmit.data.status]}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="frame background-white border-gray-06">
          <div className="frame-101 article-content">
            <Viewer content={article.description} height="100%" />
          </div>
        </div>
        {articleSubmit.visible === true ? (
          <div className="frame ">
            <div className="frame-157">
              <ArticleSubmitbutton
                learningId={learningId}
                curriculumId={curriculumId}
                articleId={article.articleId}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
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
