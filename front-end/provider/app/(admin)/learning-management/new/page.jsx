import BackButton from "@/components/BackButton";
import NewLearning from "./NewLearning";

export const metadata = {
  title: "학습 추가",
};

export default function NewLearningPage() {
  return (
    <>
      <header className="nb">
        <BackButton></BackButton>
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">학습 추가</h3>
          </div>
          <div className="frame-34-4">
            <div className="frame-117">
              <NewLearning />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
