import { useRef } from "react";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";

export async function getServerSideProps(context) {
    const { postId } = context.query;

    const getPostResponse = await fetchWithRetry(`/post/${postId}`);

    if (!getPostResponse.ok) {
        return {
            props: {
                post: null
            }
        }
    }

    return {
        props: {
            post: await getPostResponse.json()
        }
    };
}

export default function Post({ post }) {
    const viewerRef = useRef(null);

    return <>
        <input type="text" name="title" id="title" readOnly={true} value={post.title} />
        <Viewer viewerRef={viewerRef} content={post.content} />
    </>
}