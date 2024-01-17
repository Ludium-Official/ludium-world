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
      </article>
    </>
  );
}
