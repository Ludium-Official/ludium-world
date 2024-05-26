import BackButton from "@/components/BackButton";
import LearningList from "@/components/profile/learning/LearningList";
import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

export const metadata = {
  title: "나의 학습 목록",
};

async function getProfile() {
  const cookieStore = cookies();

  const getProfileResopnse = await fetchWithRetry(`/profile`, {
    headers: {
      cookie: cookieStore,
    },
  });

  if (!getProfileResopnse.ok) return null;

  return await getProfileResopnse.json();
}

export default async function LearningListPage() {
  const profile = await getProfile();
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <LearningList usrId={profile.id} />
      </article>
    </>
  );
}
