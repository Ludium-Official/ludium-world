import { getArticle } from "../page";
import EditArticleForm from "./EditArticleForm";

export const metadata = {
    title: "아티클 수정"
}

export default async function EditArticlePage({ params: { articleId } }) {
    const article = await getArticle(articleId);

    return <EditArticleForm {...article} />;
}