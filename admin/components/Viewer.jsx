"use client";

import { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import ToastViewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import DOMPurify from "dompurify";

export default function Viewer({ content, height }) {
  const viewerRef = useRef(null);
  useEffect(() => {
    const putViewer = () => {
      try {
        viewerRef.current.innerText = "";

        viewerRef.current.viewerInstance = new ToastViewer({
          el: viewerRef.current,
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
      } catch (error) {
        console.error(error);
      }
    };

    putViewer();
  }, []);

  useEffect(() => {
    if (viewerRef.current.viewerInstance === undefined) return;

    viewerRef.current.viewerInstance.setMarkdown(content);
  }, [content]);

  return <div ref={viewerRef} />;
}
