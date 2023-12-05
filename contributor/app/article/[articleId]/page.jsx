import BackButton from "../../../components/BackButton";
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

    return <>
        <ContentNavigation links={[]}>
            <BackButton />
        </ContentNavigation>
        <article className={articlestyle.wrapper}>
            <h1 className={articlestyle.title}>{article.title}</h1>
            <section className={articlestyle["content-area"]}>
                <Viewer content={article.content} height="100%" />
            </section>
        </article>
    </>
}