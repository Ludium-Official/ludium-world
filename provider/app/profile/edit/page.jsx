import { getProfile } from "../page";
import EditProfile from "./EditProfile";

export async function generateMetadata() {
  const profile = await getProfile();

  return {
    title: `${profile.nick} 프로필 수정`,
  };
}

export default async function EditProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <EditProfile profile={profile} />
    </div>
  );
}
