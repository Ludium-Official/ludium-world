"use client";

import { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import ToastViewer from "@toast-ui/editor/dist/toastui-editor-viewer";

export default function Viewer({ content, height }) {
    const viewerRef = useRef(null);
    useEffect(() => {
        const putViewer = () => {
            try {
                viewerRef.current.innerText = "";

                viewerRef.current.viewerInstance = new ToastViewer({
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

    return <div ref={viewerRef} />
}