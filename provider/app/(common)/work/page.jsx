import BackButton from "@/components/BackButton";
import dynamic from "next/dynamic";

const WorkList = dynamic(() => import("./WorkList"), {
  loading: () => <p>작업을 불러오는 중입니다...</p>,
});

export const metadata = {
  title: "웹 3.0 프로젝트 작업",
  description:
    "웹 3.0 프로젝트에 기여하고, 자유롭고 평등한 커뮤니티에서 보상을 경험하세요.",
  openGraph: {
    title: "웹 3.0 프로젝트 작업",
    description:
      "웹 3.0 프로젝트에 기여하고, 자유롭고 평등한 커뮤니티에서 보상을 경험하세요.",
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

export default async function WorkListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93-7">
          <div className="frame-57">
            <h1 className="h3-24 color-black">작업 목록</h1>
          </div>
          <div className="frame-34">
            <WorkList />
          </div>
        </div>
      </article>
    </>
  );
}
