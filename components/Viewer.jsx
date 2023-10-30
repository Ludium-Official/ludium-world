import { useEffect } from "react"

export default function Viewer({ viewerRef }) {
    useEffect(() => {
        const putViewer = async () => {
            const toastViewer = (await import("@toast-ui/editor/dist/toastui-editor-viewer")).default;
            
            try {
                viewerRef.current.innerText = "";

                viewerRef.current.viewerInstance = new toastViewer({
                    el: viewerRef.current,
                    height: "90vh",
                    initialValue: ""
                });
            } catch(error) {
                console.error(error);
            }
        }

        putViewer();
    },[]);

    return <div ref={viewerRef}>Loading</div>
}