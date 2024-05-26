import BackButton from "@/components/BackButton";
import NewCommunityForm from "./NewCommunityForm";

export const metadata = {
  title: "콘텐츠 추가",
};

export default async function NewContentPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">콘텐츠 작성</h1>
          </div>
          <div className="frame-34-4 background-white">
            <div className="frame-117">
              <NewCommunityForm />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
