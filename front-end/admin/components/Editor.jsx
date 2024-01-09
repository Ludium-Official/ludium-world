import { useEffect } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/editor";

export default function Editor({ editorRef, content, height }) {
  useEffect(() => {
    const putEditor = () => {
      try {
        editorRef.current.innerText = "";

        editorRef.current.editorInstance = new ToastEditor({
          el: editorRef.current,
          height: height ?? "300px",
          initialEditType: "wysiwyg",
          previewStyle: "tab",
          initialValue: content,
          autofocus: false,
        });
      } catch (error) {
        console.error(error);
      }
    };

    putEditor();
  }, []);

  return <div ref={editorRef} style={{ width: "100%", height: "100vh" }} />;
}
