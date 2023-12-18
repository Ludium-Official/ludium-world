import manamgementstyle from "../management.module.css";
import fetchWirhRetry from "../../../functions/api";
import BackButton from "../../../components/BackButton";
import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";

async function getUserProfile(userId) {
    const getUserProfileResponse = await fetchWirhRetry(`/profile/${userId}`);

    if (!getUserProfileResponse.ok) return null;

    return await getUserProfileResponse.json();
}

export default async function UserProfilePage({ params: { userId } }) {
    const profile = await getUserProfile(userId);

    return <>
        <ContentNavigation links={[]}>
            <BackButton />
        </ContentNavigation>
        <article className={manamgementstyle.wrapper}>
            <h1 className={manamgementstyle["profile-title"]}>내 정보</h1>
            <article className={manamgementstyle["profile-info"]}>
                <p>닉네임: {profile.nick}</p>
                <p>핸드폰 번호: {profile.phnNmb}</p>
                <p>자기소개</p>
                <div className={manamgementstyle["profile-self-intro-wrapper"]}>
                    <Viewer content={profile.selfIntro} />
                </div>
            </article>
        </article>
    </>
}