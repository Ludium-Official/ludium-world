import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Viewer from "../../components/Viewer";
import Editor from "../../components/Editor";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function getMission() {
    const router = useRouter();
    const viewerRef = useRef(null);
    const editorRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const [mission, setMission] = useState({ id: null, title: "", content: "" });

    const handleSubmitMission = () => {
        const submitContent = editorRef.current.editorInstance.getMarkdown();

        if(submitContent == null || submitContent === "") return;

        const submitFormData = new FormData();

        submitFormData.append("content", submitContent);
        
        const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

        fetch(`${serverUri}/mission/${router.query.slug}`, {
            method: "post",
            body: submitFormData,
            credentials: "include"
        })
    }

    useEffect(() => {
        const getMission = async (missionId) => {
            if (missionId) {
                const getMissionResponse = await fetch(`${serverUri}/mission/${missionId}`);

                if (getMissionResponse.ok) {

                    const mission = await getMissionResponse.json();
                    setMission(mission);

                    if (viewerRef.current.viewerInstance === undefined) {
                        setTimeout(ref => {
                            if (ref.current === null) return;
                            const viewerInstance = ref.current.viewerInstance;

                            viewerInstance.setMarkdown(mission.content);
                        }, 1000, viewerRef);
                    } else {
                        const viewerInstance = viewerRef.current.viewerInstance;

                        viewerInstance.setMarkdown(mission.content);
                    }
                }
            }
        }

        getMission(router.query.slug);
    }, []);

    return <>
        <input type="text" name="title" id="title" readOnly={true} value={mission.title} />
        <Viewer viewerRef={viewerRef} />
        <div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
            <h2>미션 제출</h2>
            <button onClick={handleSubmitMission}>제출하기</button>
            </div>
            <hr />
            <Editor editorRef={editorRef} />
        </div>
    </>
}