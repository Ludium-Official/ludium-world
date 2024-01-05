import { useEffect } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function Editor({ editorRef, content, height }) {
  useEffect(() => {
    const putEditor = async () => {
      const toastEditor = await import("@toast-ui/editor");

      try {
        editorRef.current.innerText = "";

        editorRef.current.editorInstance = new toastEditor.Editor({
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

  return (
    <div ref={editorRef} style={{ width: "100%", height: "100vh" }}>
      에디터를 불러오는 중입니다...
    </div>
  );
}
