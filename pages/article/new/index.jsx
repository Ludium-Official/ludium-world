import { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function NewArticle() {
  const [editor, setEditor] = useState(null);
  const divRef = useRef(null);

  const handleSave = _ => {
    localStorage.setItem("md-content", editor.getMarkdown());
  }

  const handleLoad = _ => {
    editor.setMarkdown(localStorage.getItem("md-content"));
  }

  useEffect(() => {
    const putEditor = async () => {
      const {Editor} = await import("@toast-ui/editor");

      divRef.current.innerText = ""
      setEditor(new Editor({
        el: divRef.current,
        height: "90vh",
        initialEditType: "wysiwyg",
        previewStyle: "tab",
      }));
    }

    putEditor();
  }, [])

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
      <div ref={divRef} style={{ width: "100%", height: "100vh" }}>Loading...</div>
    </>
  )
}