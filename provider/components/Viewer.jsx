"use client";
import "@toast-ui/editor/dist/toastui-editor.css";
import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

const copyToClipboard = (text, button) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalText = button.innerText;
      button.innerText = "복사됨";
      setTimeout(() => {
        button.innerText = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("복사 실패: ", err);
    });
};

export default function Viewer({ content, height }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    const putViewer = async () => {
      const toastViewer = (
        await import("@toast-ui/editor/dist/toastui-editor-viewer")
      ).default;
      try {
        if (viewerRef.current === null) return;
        viewerRef.current.innerText = "";
        viewerRef.current.viewerInstance = new toastViewer({
          el: viewerRef.current,
          width: "100%",
          height: height ?? "90vh",
          initialValue: content,
          usageStatistics: true,
          customHTMLRenderer: {
            htmlBlock: {
              iframe(node) {
                return [
                  {
                    type: "openTag",
                    tagName: "iframe",
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: "html", content: node.childrenHTML },
                  { type: "closeTag", tagName: "iframe", outerNewLine: true },
                ];
              },
            },
          },
          customHTMLSanitizer: (html) => {
            return DOMPurify.sanitize(html, {
              ADD_TAGS: ["iframe"],
              ADD_ATTR: [
                "rel",
                "target",
                "hreflang",
                "type",
                "frameborder",
                "allow",
                "allowfullscreen",
              ],
              FORBID_TAGS: [
                "input",
                "script",
                "textarea",
                "form",
                "button",
                "select",
                "meta",
                "style",
                "link",
                "title",
                "object",
                "base",
              ],
            });
          },
        });

        // 코드 블록에 복사 버튼 추가
        const preElements = document.querySelectorAll("pre");
        for (const codeBlock of preElements) {
          const code = codeBlock.querySelector("code");
          const buttonWrapper = document.createElement("div");
          buttonWrapper.classList.add("flex-end");
          const button = document.createElement("button");
          button.innerText = "복사";
          button.classList.add("viewer-codeblock-copy-button");

          button.addEventListener("click", () => {
            copyToClipboard(code.innerText, button);
          });

          buttonWrapper.appendChild(button);
          codeBlock.insertBefore(buttonWrapper, codeBlock.firstChild);
        }
      } catch (error) {
        console.error(error);
      }
    };
    putViewer();
  }, []);

  useEffect(() => {
    if (viewerRef.current.viewerInstance === undefined) return;

    viewerRef.current.viewerInstance.setMarkdown(content);

    // 마크다운 변경 시 코드 블록에 복사 버튼 다시 추가
    const preElements = document.querySelectorAll("pre");
    for (const codeBlock of preElements) {
      const code = codeBlock.querySelector("code");
      const buttonWrapper = document.createElement("div");
      buttonWrapper.classList.add("flex-end");
      const button = document.createElement("button");
      button.innerText = "복사";
      button.classList.add("viewer-codeblock-copy-button");

      button.addEventListener("click", () => {
        copyToClipboard(code.innerText, button);
      });

      buttonWrapper.appendChild(button);
      codeBlock.insertBefore(buttonWrapper, codeBlock.firstChild);
    }
  }, [content]);

  return (
    <div className="toast-viewer" ref={viewerRef}>
      뷰어를 불러오는 중입니다...
    </div>
  );
}
