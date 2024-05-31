import BackButton from "@/components/BackButton";
import NewCommunityForm from "./NewCommunityForm";
import ko_kr from "@/langs/ko_kr";

export async function generateMetadata({ searchParams: { type } }) {
  return {
    title: `${ko_kr[type]} 추가`,
  };
}

export default async function NewContentPage({ searchParams: { type } }) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">{ko_kr[type]} 추가</h3>
          </div>
          <div className="frame-34-4 background-white">
            <section className="frame-117">
              <NewCommunityForm type={type} />
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
