import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import articlestyle from "../article.module.css";

export const metadata = {
    title: "아티클"
}

export async function getArticle(articleId) {
    const getArticleResponse = await fetchWithRetry(`/article/${articleId}`);

    if (!getArticleResponse.ok) return null;

    return await getArticleResponse.json();
}

export default async function ArticlePage({ params: { articleId } }) {
    const article = await getArticle(articleId);
    const links = [{
        href: "/article",
        text: "돌아가기"
    }, {
        href: `/article/${articleId}/edit`,
        text: "수정하기"
    }];

    return <>
        <ContentNavigation links={links} />
        <article className={articlestyle.wrapper}>
            <h1 className={articlestyle.title}>{article.title}</h1>
            <section className={articlestyle["content-area"]}>
                <Viewer content={article.content} height="100%" />
            </section>
        </article>
    </>
}