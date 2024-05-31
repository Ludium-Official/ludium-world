import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const UserNick = dynamic(() => import("@/components/UserNick"), {
  loading: () => <>작성자 조회중...</>,
});

async function getContents() {
  const getContentResposne = await fetchWithRetry("/content");

  if (!getContentResposne.ok)
    if (getContentResposne.status === 404) return [];
    else throw new Error("콘텐츠를 불러오는 중 에러가 발생했습니다.");

  return await getContentResposne.json();
}

export default async function ContentList() {
  const contents = await getContents();

  return (
    <div className="frame-152">
      {contents.map(({ contentId, title, usrId, type, createAt, banner }) => (
        <div className="frame background-white border-gray-06" key={contentId}>
          <div className="frame-118-2">
            <div className={banner === "" ? "frame-34-5" : "frame-34-11"}>
              <div className="frame-9-6">
                <div className="frame-30"></div>
                <Link
                  className="frame-93-4 link"
                  href={`/community/${contentId}`}
                >
                  <h2 className="h4-20 color-gray-02">
                    [{ko_kr[type]}] {title}
                  </h2>
                </Link>
                <div className="frame-100-3">
                  <p className="caption-12 color-gray-04">
                    작성 일시: {getTimeStamp(createAt)}
                  </p>
                </div>
                <div className="frame-100-3">
                  <p className="caption-12 color-gray-04">
                    작성자: <UserNick usrId={usrId} />
                  </p>
                </div>
              </div>
              {banner === "" ? null : (
                <Link href={`/community/${contentId}`}>
                  <Image src={banner} alt={title} width={400} height={116} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
