import BackButton from "@/components/BackButton";
import dynamic from "next/dynamic";

const LearningList = dynamic(() => import("./LearningList"), {
  loading: () => <p>학습을 불러오는 중입니다...</p>,
});

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
  title: "웹 3.0 프로젝트 학습 참여",
  description:
    "웹 3.0 기반의 평등한 참여와 학습으로 보상 받는 커뮤니티를 경험하세요.",
  openGraph: {
    title: "웹 3.0 프로젝트 학습 참여",
    description:
      "웹 3.0 기반의 평등한 참여와 학습으로 보상 받는 커뮤니티를 경험하세요.",
    url: process.env.NEXT_PUBLIC_SITE_MAP_URL,
    siteName: "루디움",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "logo1.png",
        width: 70,
        height: 32,
        alt: "루디움",
      },
    ],
  },
};

export default async function ParticipationListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <h1 className="h3-24">학습 참여</h1>
          <div className="frame-34">
            <div className="frame-101">
              <div className="frame-9">
                <h2 className="h4-20 color-black">학습 목록</h2>
              </div>
            </div>
            <LearningList />
          </div>
        </div>
      </article>
    </>
  );
}
