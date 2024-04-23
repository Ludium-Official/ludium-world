import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";

const UserList = dynamic(() => import("./UserList"), {
  ssr: false,
});

export const metadata = {
  title: "사용자 관리",
};

async function getUsers() {
  const getUserListResponse = await fetchWithRetry("/user");

  if (!getUserListResponse.ok) {
    return [];
  }

  return await getUserListResponse.json();
}

export default async function ManagementPage() {
  const users = await getUsers();

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <UserList users={users} />
      </article>
    </>
  );
}
