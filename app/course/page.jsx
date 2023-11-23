import Link from "next/link";
import fetchWithRetry from "../../functions/api";

async function getCourseList() {
    const getCoursesResponse = await fetchWithRetry(`/course`);

    if (!getCoursesResponse.ok) return [];

    return await getCoursesResponse.json();
}

export default async function CoursePage() {
    const courses = await getCourseList();

    return <>
    <Link href="/course/new">교육 만들기</Link>
    <h1>교육 목록</h1>
    <div style={{ display: "flex", flexDirection: "column" }}>
        {courses.map(course => (
            <Link key={course.id} href={`/course/${course.id}`}>{course.title}</Link>
        ))}
    </div>
</>
}