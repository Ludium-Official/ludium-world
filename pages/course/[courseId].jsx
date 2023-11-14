import { useRef } from "react";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";
import Link from "next/link";

export async function getServerSideProps(context) {
    const { courseId } = context.query;

    const getCourseResponse = await fetchWithRetry(`/course/${courseId}`);

    if (!getCourseResponse.ok) {
        return {
            props: {
                course: null,
                courseId
            }
        }
    }

    return {
        props: {
            course: await getCourseResponse.json(),
            courseId
        }
    }
}

export default function GetCourse({ course, courseId }) {
    const viewerRef = useRef(null);

    return <>
        <input type="text" defaultValue={course.title} readOnly />
        <h1>모듈 목록</h1>
        {course.modules.map(module => <div key={module.id}>
            <Link href={`/course/${courseId}/module/${module.id}`}>{module.title}</Link>
        </div>)}
        <hr />
        <Viewer viewerRef={viewerRef} content={course.content} />
    </>;
}