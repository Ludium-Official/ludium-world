"use client";

import { useEffect, useRef } from "react"

export default function Viewer({ content, height }) {
    const viewerRef = useRef(null);
    useEffect(() => {
        const putViewer = async () => {
            const toastViewer = (await import("@toast-ui/editor/dist/toastui-editor-viewer")).default;

            try {
                if (viewerRef.current === null) return;

                viewerRef.current.innerText = "";

                viewerRef.current.viewerInstance = new toastViewer({
                    el: viewerRef.current,
                    height: height ?? "90vh",
                    initialValue: content
                });
            } catch (error) {
                console.error(error);
            }
        }

        putViewer();
    }, []);

    useEffect(() => {
        if (viewerRef.current.viewerInstance === undefined) return;

        viewerRef.current.viewerInstance.setMarkdown(content);
    }, [content])

    return <div ref={viewerRef}>Loading</div>
}