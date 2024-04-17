import BackButton from "@/components/BackButton";
import MissionList from "@/components/profile/mission/MissionList";
import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

export const metadata = {
  title: "나의 미션 목록",
};

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

export default async function MyMissionList({}) {
  const profile = await getProfile();

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <MissionList usrId={profile.id} />
      </article>
    </>
  );
}
