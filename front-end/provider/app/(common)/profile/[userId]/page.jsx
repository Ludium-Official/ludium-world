import BackButton from "@/components/BackButton";
import Application from "@/components/profile/visit/Application";
import Avatar from "@/components/profile/visit/Avatar";
import Learning from "@/components/profile/visit/Learning";
import Mission from "@/components/profile/visit/Mission";
import Work from "@/components/profile/visit/Work";
import fetchWithRetry from "@/functions/api";

export async function generateMetadata({ params: { userId } }) {
  const profile = await getUser(userId);

  return {
    title: `${profile.nick} 프로필`,
    description: `${profile.selfIntro}`,
  };
}

async function getUser(userId) {
  const getUserResponse = await fetchWithRetry(`/user/${userId}`);

  if (!getUserResponse.ok) {
    throw new Error(500);
  }

  return await getUserResponse.json();
}

export default async function UserProfilePage({ params: { userId } }) {
  const user = await getUser(userId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-76">
          <Avatar profile={user} />
          <div className="frame-42">
            <Mission usrId={userId} nick={user.nick} />
            <Work usrId={userId} nick={user.nick} />
          </div>
          <div className="frame-42">
            <Learning usrId={userId} nick={user.nick} />
            <Application usrId={userId} nick={user.nick} />
          </div>
        </div>
      </article>
    </>
  );
}
