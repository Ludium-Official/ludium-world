import Link from "next/link";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import coursestyle from "../course.module.css";
import ContentNavigation from "../../../components/ContentNavigation";
import DeleteCourse from "./DeleteCourse";

async function getCourse(courseId) {
    const getCourseResponse = await fetchWithRetry(`/course/${courseId}`);

    if (!getCourseResponse.ok) return null;

    return await getCourseResponse.json();
}

export default async function CoursePage({ params: { courseId } }) {
    const course = await getCourse(courseId);
    const links = [{
        href: "/course",
        text: "돌아가기"
    }]

    return <>
        <ContentNavigation links={links}>
            <DeleteCourse courseId={courseId} />
        </ContentNavigation>
        <article className={coursestyle.wrapper}>
            <h1 className={coursestyle.title}>{course.title}</h1>
            <section className={coursestyle["content-area"]}>
                <Viewer content={course.content} height="100%" />
            </section>
            {/* <h2 className={coursestyle["title-label"]}>모듈 목록</h2>
            <section className={`${coursestyle["course-list"]} ${coursestyle["module-list"]}`}>
                {course.modules.map(module => <h2 className={coursestyle["course-list-item"]} key={module.id}>
                    <Link href={`/course/${courseId}/module/${module.id}`}>{module.title}</Link>
                </h2>)}
            </section> */}
        </article>
    </>
}