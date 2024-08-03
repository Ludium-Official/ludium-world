import BackButton from "@/components/BackButton";
import MyWorkList from "@/components/profile/work/MyWorkList";
import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

export const metadata = {
  title: "나의 작업 목록",
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

export default async function MyWorkPage() {
  const profile = await getProfile();

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <MyWorkList usrId={profile.id} />
      </article>
    </>
  );
}
