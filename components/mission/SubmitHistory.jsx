"use client";

import { useRef } from "react"
import Viewer from "../Viewer";

export default function SubmitHistory({ id, content, createAt }) {
    const viewerRef = useRef(null);

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Viewer content={content} />
            <p>{createAt}</p>
        </div>
    )
}