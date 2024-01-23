import fetchWithRetry from "@/functions/api";
import EditCommunityForm from "./EditCommunityForm";
import BackButton from "@/components/BackButton";

export async function generateMetadata({ params: { communityId } }) {
  const content = await getContent(communityId);

  return {
    title: content.title,
    description: content.description,
  };
}

async function getContent(contentId) {
  const getContentResponse = await fetchWithRetry(`/content/${contentId}`);

  if (!getContentResponse.ok)
    throw new Error("콘텐츠를 조회하는 중 에러가 발생했습니다.");

  return await getContentResponse.json();
}

export default async function EditContentPage({ params: { communityId } }) {
  const content = await getContent(communityId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <EditCommunityForm key={crypto.randomUUID()} content={content} />
    </>
  );
}
