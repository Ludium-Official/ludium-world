import { cookies } from "next/headers";
import ContentNavigation from "../../components/ContentNavigation";
import Viewer from "../../components/Viewer";
import fetchWithRetry from "../../functions/api";

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

async function ApplicationList({ usrId }) {
  const applications = await getApplicationList(usrId);

  return (
    <>
      <h2 className="header2">지원서 목록</h2>
      <details className="profile-application" open={true}>
        <summary className="profile-application-summary" />
        {applications.map((application) => (
          <section key={application.applicationId}>
            <span className="space-between">
              <h3 className="header3">지원서 제목: {application.title}</h3>
              <p className="text1">지원서 종류: {application.role}</p>
            </span>
            <div className="viewer-content">
              <Viewer content={application.description} height="100%" />
            </div>
          </section>
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
      </article>
    </>
  );
}
