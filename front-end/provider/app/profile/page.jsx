import BackButton from "@/components/BackButton";
import Application from "@/components/profile/Application";
import Avatar from "@/components/profile/Avatar";
import Learning from "@/components/profile/Learning";
import Mission from "@/components/profile/Mission";
import Work from "@/components/profile/Work";
import { cookies } from "next/headers";
import fetchWithRetry from "../../functions/api";

export async function generateMetadata() {
  const profile = await getProfile();

  return {
    title: `${profile.nick} 프로필`,
    description: `${profile.selfIntro}`,
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
      text: "수정 페이지로 이동",
    },
  ];

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-76">
          <Avatar profile={profile} />
          <div className="frame-42">
            <Application usrId={profile.id} />
            <Work usrId={profile.id} />
          </div>
          <div className="frame-43">
            <Learning usrId={profile.id} />
            <Mission usrId={profile.id} />
          </div>
        </div>
      </article>
    </>
  );
}
