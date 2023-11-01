import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Viewer from "../../components/Viewer";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function GetPost() {
    const router = useRouter();
    const viewerRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const [post, setPost] = useState({ id: null, title: "", content: "" });

    useEffect(() => {
        const getPost = async (postId) => {
            if (postId) {
                const getPostResponse = await fetch(`${serverUri}/post/${postId}`);

                if (getPostResponse.ok) {

                    const post = await getPostResponse.json();
                    setPost(post);

                    if (viewerRef.current.viewerInstance === undefined) {
                        setTimeout(ref => {
                            if (ref.current === null) return;
                            const viewerInstance = ref.current.viewerInstance;

                            viewerInstance.setMarkdown(post.content);
                        }, 1000, viewerRef);
                    } else {
                        const viewerInstance = viewerRef.current.viewerInstance;

                        viewerInstance.setMarkdown(post.content);
                    }
                }
            }
        }

        getPost(router.query.slug);
    }, []);

    return <>
        <input type="text" name="title" id="title" readOnly={true} value={post.title} />
        <Viewer viewerRef={viewerRef} />
    </>
}