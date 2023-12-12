import { useRef } from "react";
import fetchWithRetry from "../../functions/api";
import dynamic from "next/dynamic";

const Viewer = dynamic(() => import("../../components/Viewer"), {ssr: false});

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