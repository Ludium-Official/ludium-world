import BackButton from "@/components/BackButton";
import RewardList from "@/components/profile/reward/RewardList";

export const metadata = {
  title: "나의 보상 목록",
};

export default async function RewardListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <RewardList />
      </article>
    </>
  );
}
