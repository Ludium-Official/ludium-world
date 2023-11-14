import Link from "next/link";
import fetchWithRetry from "../../functions/api";


export async function getServerSideProps() {
    const getCoursesResponse = await fetchWithRetry(`/course`);

    if (!getCoursesResponse.ok) {
        return {
            props: {
                courses: []
            }
        }
    }

    return {
        props: {
            courses: await getCoursesResponse.json()
        }
    };
}

export default function Course({courses}) {
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