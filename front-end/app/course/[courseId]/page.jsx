import Link from "next/link";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import coursestyle from "../course.module.css";

async function getCourse(courseId) {
    const getCourseResponse = await fetchWithRetry(`/course/${courseId}`);

    if (!getCourseResponse.ok) return null;

    return await getCourseResponse.json();
}

export default async function CoursePage({ params: {courseId} }) {
    const course = await getCourse(courseId);

    return <article className={coursestyle.wrapper}>
        <input type="text" defaultValue={course.title} readOnly />
        <h1>모듈 목록</h1>
        {course.modules.map(module => <div key={module.id}>
            <Link href={`/course/${courseId}/module/${module.id}`}>{module.title}</Link>
        </div>)}
        <hr />
        <Viewer content={course.content} />
    </article>;
}