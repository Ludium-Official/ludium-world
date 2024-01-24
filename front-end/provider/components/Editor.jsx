import { uploadImage } from "@/functions/actions/ImageUpload";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useEffect } from "react";

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
          hooks: {
            async addImageBlobHook(blob, callback) {
              if (blob.size >= 4194304) {
                alert("4MB 이상의 사이즈는 업로드 할 수 없습니다.");
                return;
              }

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

  return (
    <div ref={editorRef} style={{ width: "100%", height: "100vh" }}>
      에디터를 불러오는 중입니다...
    </div>
  );
}
