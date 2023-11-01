import { useEffect } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function Editor({ editorRef, content }) {
    useEffect(() => {
        const putEditor = async () => {
            const toastEditor = await import("@toast-ui/editor");

            try {
                editorRef.current.innerText = "";

                editorRef.current.editorInstance = new toastEditor.Editor({
                    el: editorRef.current,
                    height: "90vh",
                    initialEditType: "wysiwyg",
                    previewStyle: "tab",
                    initialValue: content
                });
            } catch (error) {
                console.error(error);
            }
        }

        putEditor();
    }, []);

    return <div ref={editorRef} style={{ width: "100%", height: "100vh" }}>Loading...</div>;
}