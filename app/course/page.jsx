import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import coursestyle from "./course.module.css";
import ContentNavigation from "../../components/ContentNavigation";

async function getCourseList() {
  const getCoursesResponse = await fetchWithRetry(`/course`);

  if (!getCoursesResponse.ok) return [];

  return await getCoursesResponse.json();
}

export default async function CoursePage() {
  const courses = await getCourseList();
  const courseLinks = [
    {
      href: "/course/new",
      text: "교육 만들기",
    },
  ];

  return (
    <>
      <ContentNavigation links={courseLinks} />
      <article className={coursestyle.wrapper}>
        <h1>교육 목록</h1>
        <div className={coursestyle["course-list"]}>
          {courses.map((course) => (
            <h2 className={coursestyle["course-list-item"]}>
              <Link key={course.id} href={`/course/${course.id}`}>
                {course.title}
              </Link>
            </h2>
          ))}
        </div>
      </article>
    </>
  );
}
