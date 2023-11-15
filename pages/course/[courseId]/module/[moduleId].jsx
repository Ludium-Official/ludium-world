import Link from "next/link";
import { useRef } from "react";
import Viewer from "../../../../components/Viewer";
import fetchWithRetry from "../../../../functions/api";

export async function getServerSideProps(context) {
    const { courseId, moduleId } = context.query;

    const getModuleResponse = await fetchWithRetry(`/course/${courseId}/${moduleId}`);

    return {
        props: {
            module: await getModuleResponse.json(),
            courseId,
            moduleId,
        }
    }
}

export default function GetModule({ module, courseId, moduleId }) {
    const viewerRef = useRef(null);

    return <>
        <Link href={`/course/${courseId}/module/${moduleId}/edit`}>수정하기</Link>
        <hr />
        <input type="text" defaultValue={module.title} readOnly />
        <input type="text" defaultValue={module.category} placeholder="카테고리 값 없음" readOnly />
        <hr />
        <h1>모듈 참고 링크</h1>
        {module.moduleReferences.map(moduleReference => <div key={moduleReference.artId}>
            <Link href={`/mission/${moduleReference.artId}`}>{moduleReference.artId}</Link>
        </div>)}
        <hr />
        <Viewer viewerRef={viewerRef} content={module.content} />
    </>;
}