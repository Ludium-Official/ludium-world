import { useRef } from "react";
import Viewer from "../Viewer";

export default function SubmitComment({ id, content, nick, createAt }) {
  const viewerRef = useRef(null);

  return <div style={{ display: "flex", justifyContent: "space-between" }}>
    <Viewer viewerRef={viewerRef} content={content} />
    <p>{nick}</p>
    <p>{createAt}</p>
  </div>;
}