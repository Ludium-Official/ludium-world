import { useRef } from "react";
import Viewer from "../../components/Viewer";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { postId } = context.query;

    const getPostResponse = await fetch(`${serverUri}/post/${postId}`);

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