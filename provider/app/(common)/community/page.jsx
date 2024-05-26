import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import dynamic from "next/dynamic";
import Link from "next/link";

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
  title: "커뮤니티 게시판",
  description:
    "웹 3.0 기반 커뮤니티에서 평등한 소통과 창조적 교류를 추구하는 모든 이의 공간. 공지, 콘텐츠, 자유 질문 게시판 이용 가능.",
  openGraph: {
    title: "커뮤니티 게시판",
    description:
      "웹 3.0 기반 커뮤니티에서 평등한 소통과 창조적 교류를 추구하는 모든 이의 공간. 공지, 콘텐츠, 자유 질문 게시판 이용 가능.",
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

const ContentList = dynamic(() => import("./ContentList"), {
  loading: () => <p>Loading...</p>,
});

export default async function CommunityListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
        <Link className="frame-56 link" href="/community/new">
          <Icon src="/icon_write.svg" alt="추가하기" width={24} height={24} />
          <p className="h4-20 color-purple-01">추가하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">콘텐츠 리스트</h1>
          </div>
          <ContentList />
        </div>
      </article>
    </>
  );
}
