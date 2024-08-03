import BackButton from "@/components/BackButton";
import { cookies } from "next/headers";
import fetchWithRetry from "@/functions/api";
import Icon from "@/components/Icon";
import Link from "next/link";
import dynamic from "next/dynamic";

const Avatar = dynamic(() => import("@/components/profile/Avatar"), {
  loading: () => <p>내 정보를 조회하는 중입니다...</p>,
});

const Mission = dynamic(() => import("@/components/profile/Mission"), {
  loading: () => <p>미션을 조회하는 중입니다...</p>,
});

const Work = dynamic(() => import("@/components/profile/Work"), {
  loading: () => <p>작업을 조회하는 중입니다...</p>,
});

const Learning = dynamic(() => import("@/components/profile/Learning"), {
  loading: () => <p>학습을 조회하는 중입니다...</p>,
});

const Application = dynamic(() => import("@/components/profile/Application"), {
  loading: () => <p>지원서를 조회하는 중입니다...</p>,
});

const Reward = dynamic(() => import("@/components/profile/Reward"), {
  loading: () => <p>보상을 조회하는 중입니다...</p>,
});

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

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-76">
          <Avatar profile={profile} />
          <div className="frame-42">
            {/* <div className="frame-44-2"> */}
            <div className="frame-34-6 background-white border-gray-06">
              {/* <div className="frame-34-7 background-white border-gray-06"> */}
              <div className="frame-35-2">
                <h1 className="h4-20 color-black">나의 미션</h1>
                <Link className="frame-56-2 link" href="/profile/mission">
                  <p className="more color-gray-04">모두 보기</p>
                  <div className="arrow-right">
                    <div className="frame-78">
                      <Icon
                        src="/icon_arrow_right.svg"
                        alt="more"
                        width={12}
                        height={12}
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <Mission usrId={profile.id} />
            </div>
            {/* </div> */}
            <div className="frame-34-6 background-white border-gray-06">
              <div className="frame-35-2">
                <h1 className="h4-20 color-black">나의 작업</h1>
                <Link className="frame-56-2 link" href="/profile/work">
                  <p className="more color-gray-04">모두 보기</p>
                  <div className="arrow-right">
                    <div className="frame-78">
                      <Icon
                        src="/icon_arrow_right.svg"
                        alt="more"
                        width={12}
                        height={12}
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <Work usrId={profile.id} />
            </div>
          </div>
          {/* <div className="frame-43"> */}
          <div className="frame-42">
            {/* <div className="frame-92"> */}
            {/* <div className="frame-34-7 background-white border-gray-06"> */}
            <div className="frame-34-6 background-white border-gray-06">
              <div className="frame-35-3">
                <div className="frame-9">
                  <h1 className="h4-20 color-black">나의 학습</h1>
                  <Link className="frame-56-2 link" href="/profile/learning">
                    <p className="more color-gray-04">모두 보기</p>
                    <div className="arrow-right">
                      <div className="frame-78">
                        <Icon
                          src="/icon_arrow_right.svg"
                          alt="more"
                          width={12}
                          height={12}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              {/* <div className="frame-9-2"> */}
              {/* 전체 달성률 그래프 */}
              {/* <div className="frame-93-5">
            <div className="frame-9-4"></div>
          </div> */}
              <div className="frame-96">
                <div className="frame-93-6">
                  <Learning usrId={profile.id} />
                </div>
                {/* </div> */}
              </div>
            </div>
            {/* </div> */}
            <div className="frame-34-6 background-white border-gray-06">
              <div className="frame-35-2">
                <h1 className="h4-20 color-black">나의 지원서</h1>
                {/* <Link className="frame-56-2 link" href="/">
                  <p className="more color-gray-04">모두 보기</p>
                  <div className="arrow-right">
                    <div className="frame-78">
                      <Icon
                        src="/icon_arrow_right.svg"
                        alt="more"
                        width={12}
                        height={12}
                      />
                    </div>
                  </div>
                </Link> */}
              </div>
              <Application usrId={profile.id} />
            </div>
          </div>
          <div className="frame-42">
            <div className="frame-34-6 background-white border-gray-06">
              <div className="frame-35-3">
                <div className="frame-9">
                  <h4 className="h4-20 color-black">나의 보상</h4>
                  <Link className="frame-56-2 link" href="/profile/reward">
                    <p className="more color-gray-04">모두 보기</p>
                    <div className="arrow-right">
                      <div className="frame-78">
                        <Icon
                          src="/icon_arrow_right.svg"
                          alt="more"
                          width={12}
                          height={12}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="frame-96">
                <div className="frame-93-6">
                  <Reward usrId={profile.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
