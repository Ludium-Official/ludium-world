import NewCommunityForm from "./NewCommunityForm";

export const metadata = {
  title: "콘텐츠 추가",
};

export default async function NewContentPage({ searchParams: { type } }) {
  return <NewCommunityForm type={type} />;
}
