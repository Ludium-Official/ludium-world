import BackButton from "@/components/BackButton";
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
    <>
      <header className="nb">
        <BackButton />
      </header>
      <div className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">프로필 수정</h1>
          </div>
          <EditProfile profile={profile} />
        </div>
      </div>
    </>
  );
}
