import { cookies } from "next/headers";
import ContentNavigation from "../../components/ContentNavigation";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";
import Link from "next/link";

export async function generateMetadata() {
  const profile = await getProfile();

  return {
    title: `${profile.nick} 프로필`,
  };
}

export async function getProfile() {
  const cookieStore = cookies();

  const getProfileResopnse = await fetchWithRetry(`/profile`, {
    headers: {
      cookie: cookieStore,
    },
  });

  if (!getProfileResopnse.ok) return null;

  return await getProfileResopnse.json();
}

async function getApplicationList(usrId) {
  const getApplicationListResponse = await fetchWithRetry(
    `/profile/${usrId}/application`
  );

  if (!getApplicationListResponse.ok)
    if (getApplicationListResponse.status === 404) return [];
    else throw new Error("지원서를 조회하는 중 에러가 발생했습니다.");

  return await getApplicationListResponse.json();
}

async function getWorkList(usrId) {
  const getWorkListResponse = await fetchWithRetry(
    `/profile/${usrId}/detailed-announcement`
  );

  if (!getWorkListResponse.ok)
    if (getWorkListResponse.status === 404) return [];
    else throw new Error("작업을 조회하는 중 에러가 발생했습니다.");

  return await getWorkListResponse.json();
}

async function getMissionList(usrId) {
  const getMissionListResponse = await fetchWithRetry(
    `/profile/${usrId}/mission`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

async function getLearningList(usrId) {
  const getLearningListResponse = await fetchWithRetry(
    `/profile/${usrId}/learning`
  );

  if (!getLearningListResponse.ok)
    if (getLearningListResponse.status === 404) return [];
    else throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningListResponse.json();
}

async function LearningList({ usrId }) {
  const learnings = await getLearningList(usrId);

  return (
    <>
      <h2 className="header2">학습 목록</h2>
      <details className="profile-contents" open={true}>
        <summary className="profile-contents-summary" />
        {learnings.map((learning) => (
          <section className="work-section" key={learning.postingId}>
            <span className="space-between">
              <h3 className="header3">제목: {learning.title}</h3>
            </span>
            <Link
              className="work-section-link"
              href={`/participation/${learning.postingId}`}
            >
              <h3 className="header3">{learning.title} 학습 페이지로 이동</h3>
            </Link>
          </section>
        ))}
      </details>
    </>
  );
}

async function MissionList({ usrId }) {
  const missions = await getMissionList(usrId);

  return (
    <>
      <h2 className="header2">미션 목록</h2>
      <details className="profile-contents" open={true}>
        <summary className="profile-contents-summary" />
        {missions.map((mission) => (
          <section className="work-section" key={mission.missionId}>
            <span className="space-between">
              <h3 className="header3">제목: {mission.title}</h3>
              <p className="text1">
                작업 상태: {mission.status === "APPROVE" ? "승인됨" : "미승인"}
              </p>
            </span>
            <Link
              className="work-section-link"
              href={`/participation/${mission.postingId}#${mission.missionId}`}
            >
              <h3 className="header3">{mission.title} 미션 페이지로 이동</h3>
            </Link>
          </section>
        ))}
      </details>
    </>
  );
}

async function WorkList({ usrId }) {
  const works = await getWorkList(usrId);

  return (
    <>
      <h2 className="header2">작업 목록</h2>
      <details className="profile-contents" open={true}>
        <summary className="profile-contents-summary" />
        {works.map((work) => (
          <section className="work-section" key={work.detailId}>
            <span className="space-between">
              <h3 className="header3">제목: {work.title}</h3>
              <p className="text1">
                미션 상태: {work.status === "APPROVE" ? "승인됨" : "미승인"}
              </p>
            </span>
            <Link className="work-section-link" href={`/work/${work.detailId}`}>
              <h3 className="header3">{work.title} 작업 페이지로 이동</h3>
            </Link>
          </section>
        ))}
      </details>
    </>
  );
}

async function ApplicationList({ usrId }) {
  const applications = await getApplicationList(usrId);

  return (
    <>
      <h2 className="header2">지원서 목록</h2>
      <details className="profile-contents" open={true}>
        <summary className="profile-contents-summary" />
        {applications.map((application) => (
          <div key={application.applicationId}>
            <span className="space-between">
              <h3 className="header3">지원서 제목: {application.title}</h3>
              <p className="text1">지원서 종류: {application.role}</p>
            </span>
            <div className="viewer-content">
              <Viewer content={application.description} height="100%" />
            </div>
          </div>
        ))}
      </details>
    </>
  );
}

export default async function ProfilePage() {
  const profile = await getProfile();

  const links = [
    {
      href: "/profile/edit",
      text: "내 정보 수정하기",
    },
  ];

  return (
    <>
      <div className="flex-end">
        <ContentNavigation links={links} />
      </div>
      <article className="wrapper">
        <h1 className="header1">내 정보</h1>
        <p className="text1">
          {profile.nick} ({profile.phnNmb})
        </p>
        <h2 className="header2">자기소개</h2>
        <div className="viewer-content">
          <Viewer content={profile.selfIntro} />
        </div>
        <ApplicationList usrId={profile.id} />
        <WorkList usrId={profile.id} />
        <LearningList usrId={profile.id} />
        <MissionList usrId={profile.id} />
      </article>
    </>
  );
}
