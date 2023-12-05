import { getCourse } from "../page"
import EditCourse from "./EditCourse";

export const metadata = {
    title: "교육 수정"
}

export default async function EditCoursePage({ params: { courseId } }) {
    const course = await getCourse(courseId);

    return <EditCourse {...course} />
}