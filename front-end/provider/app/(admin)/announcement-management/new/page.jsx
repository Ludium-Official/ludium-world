import BackButton from "@/components/BackButton";
import NewAnnouncement from "./NewAnnouncement";

export const metadata = {
  title: "공고 추가",
};

export default function NewAnnouncementPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">공고 추가</h3>
          </div>
          <div className="frame-34-4">
            <div className="frame-117">
              <NewAnnouncement />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
