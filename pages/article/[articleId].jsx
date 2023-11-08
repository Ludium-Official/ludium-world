import { useRef } from "react";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";

export async function getServerSideProps(context) {
    const { articleId } = context.query;

    const getArticleResponse = await fetchWithRetry(`/article/${articleId}`);

    if (!getArticleResponse.ok) {
        return {
            props: {
                article: null
            }
        }
    }

    return {
        props: {
            article: await getArticleResponse.json()
        }
    };
}

export default function GetArticle({ article }) {
    const viewerRef = useRef(null);

    return <>
        <input type="text" name="title" id="title" readOnly={true} value={article.title} />
        <Viewer viewerRef={viewerRef} content={article.content} />
    </>
}