import fetchWithRetry from "@/functions/api";

async function getUser(usrId) {
  const getUserResponse = await fetchWithRetry(`/user/${usrId}`);

  if (!getUserResponse.ok) throw new Error(500);

  return await getUserResponse.json();
}

export default async function UserNick({ usrId }) {
  const user = await getUser(usrId);

  return <>{user.nick}</>;
}
