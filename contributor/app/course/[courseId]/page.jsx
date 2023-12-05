import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import coursestyle from "../course.module.css";

export const metadata = {
    title: "교육"
}

export async function getCourse(courseId) {
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
        </ContentNavigation>
        <article className={coursestyle.wrapper}>
            <h1 className={coursestyle.title}>{course.title}</h1>
            <section className={coursestyle["content-area"]}>
                <Viewer content={course.content} height="100%" />
            </section>
        </article>
    </>
}