import { useRef } from "react";
import Viewer from "../../components/Viewer";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { articleId } = context.query;

    const getArticleResponse = await fetch(`${serverUri}/article/${articleId}`);

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