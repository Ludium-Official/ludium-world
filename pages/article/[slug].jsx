import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Viewer from "../../components/Viewer";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function getArticle() {
    const router = useRouter();
    const viewerRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const [article, setArticle] = useState({ id: null, title: "", content: "" });

    useEffect(() => {
        const getArticle = async (articleId) => {
            if (articleId) {
                const getArticleResponse = await fetch(`${serverUri}/article/${articleId}`);

                if (getArticleResponse.ok) {

                    const article = await getArticleResponse.json();
                    setArticle(article);

                    setTimeout(ref => {
                        const viewerInstance = ref.current.viewerInstance;

                        viewerInstance.setMarkdown(article.content);
                    }, 1000, viewerRef);
                }
            }
        }

        getArticle(router.query.slug);
    }, []);

    return <>
        <input type="text" name="title" id="title" readOnly={true} value={article.title} />
        <Viewer viewerRef={viewerRef} />
    </>
}