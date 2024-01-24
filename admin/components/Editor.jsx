import { useEffect } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/editor";
import { uploadImage } from "@/functions/actions/ImageUpload";

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
          hooks: {
            async addImageBlobHook(blob, callback) {
              const formData = new FormData();

              formData.append("image", blob);

              const imageUploadResponse = await uploadImage(formData);

              if (imageUploadResponse === false) {
                alert("이미지를 업로드 하는 중 에러가 발생했습니다.");
                return;
              }

              callback(imageUploadResponse, blob.name);
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    putEditor();
  }, []);

  return <div ref={editorRef} style={{ width: "100%", height: "100vh" }} />;
}
