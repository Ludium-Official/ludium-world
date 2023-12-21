import dynamic from "next/dynamic";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import ContentNavigation from "../../../components/ContentNavigation";
import fetchWithRetry from "../../../functions/api";
import applystyle from "../apply.module.css";
import ApplyModule from "./ApplyModule";
import ProviderSelectBox from "./ProviderSelectBox";

const Viewer = dynamic(() => import("../../../components/Viewer"), {
  ssr: false,
});

export async function getApply(applyId) {
  const applyResponse = await fetchWithRetry(`/apply/${applyId}`);

  if (!applyResponse.ok) return null;

  return await applyResponse.json();
}

async function getModuleList() {
  const moduleListResponse = await fetchWithRetry("/module");

  if (!moduleListResponse.ok) return [];

  return await moduleListResponse.json();
}

async function getModuleReference(applyId) {
  const moduleReferenceResponse = await fetchWithRetry(
    `/apply/${applyId}/moduleReference`
  );

  if (!moduleReferenceResponse.ok) return null;

  return await moduleReferenceResponse.json();
}

async function ModuleList({ applyId }) {
  const modules = await getModuleList();
  const selectedModuleReferenece = await getModuleReference(applyId);

  return (
    <ApplyModule
      applyId={applyId}
      modules={modules}
      moduleReferenece={selectedModuleReferenece}
    />
  );
}

async function getSubmitApplyCount(applyId) {
  const submitApplyCount = await fetchWithRetry(
    `/apply/${applyId}/submit/count`
  );

  if (!submitApplyCount.ok) return 0;

  return await submitApplyCount.json();
}

async function getSubmitApplyList(applyId) {
  const submitApplyList = await fetchWithRetry(`/apply/${applyId}/submit/all`);

  if (!submitApplyList.ok) return [];

  return await submitApplyList.json();
}

async function SubmitCount({ applyId }) {
  const submitApplyCount = await getSubmitApplyCount(applyId);

  return <h1>현재 제출된 지원서 : {submitApplyCount} 개</h1>;
}

async function SubmitList({ applyId }) {
  const submits = await getSubmitApplyList(applyId);

  return (
    <>
      <h2>지원서 제출 목록</h2>
      <hr />
      {submits.map(({ nick, content }) => (
        <section key={crypto.randomUUID()}>
          <h3 className={applystyle.label}>지원자: {nick}</h3>
          <article className={applystyle["content-area"]}>
            <Viewer content={content} heihgt="100%" />
          </article>
        </section>
      ))}
    </>
  );
}

async function getMakeList(moduleId) {
  const getMakeListResponse = await fetchWithRetry(`/module/${moduleId}/make`);

  if (!getMakeListResponse.ok) return [];

  return await getMakeListResponse.json();
}

async function getMake(makeId) {
  const getMakeResponse = await fetchWithRetry(`/article/${makeId}`);

  if (!getMakeResponse.ok) return null;

  return await getMakeResponse.json();
}

async function ModuleAsignWrapper({ applyId }) {
  const selectedModuleReferenece = await getModuleReference(applyId);

  if (selectedModuleReferenece === null) return null;

  const makes = await getMakeList(selectedModuleReferenece.mdlId);
  const submits = await getSubmitApplyList(applyId);

  return (
    <article>
      <h2>제작자 권한 할당</h2>
      <article className={applystyle["make-list"]}>
        <section
          className={`${applystyle["make-list-item"]} ${applystyle["make-list-header"]}`}
        >
          <p className={applystyle["make-list-column"]}>제작명</p>
          <p className={applystyle["make-list-column"]}>현재 제작자</p>
          <p className={applystyle["make-list-column"]}>제작 지원자</p>
        </section>
        {makes.map(({ id, title }) => (
          <MakeItem key={id} id={id} title={title} submits={submits} moduleId={selectedModuleReferenece.mdlId} />
        ))}
      </article>
    </article>
  );
}

async function getProfile(usrId) {
  const getProfileResponse = await fetchWithRetry(`/profile/${usrId}`);

  if (!getProfileResponse.ok) return null;

  return await getProfileResponse.json();
}

async function MakeItem({ id, title , submits, moduleId }) {
  const make = await getMake(id);
  const profile = await getProfile(make.usrId);

  return (
    <section className={applystyle["make-list-item"]} key={id}>
      <p className={applystyle["make-list-column"]}>{title}</p>
      <p className={applystyle["make-list-column"]}>{profile.nick}</p>
      <ProviderSelectBox moduleId={moduleId} makeId={id} submits={submits} />
    </section>
  );
}

export default async function ApplyPage({ params: { applyId } }) {
  const apply = await getApply(applyId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
        <Link href={`/apply/${applyId}/edit`}>수정하기</Link>
      </ContentNavigation>
      <article className={applystyle.wrapper}>
        <SubmitCount applyId={applyId} />
        <ModuleList applyId={applyId} />
        <ModuleAsignWrapper applyId={applyId} />
        <h1 className={applystyle.title}>{apply.title}</h1>
        <section className={applystyle["content-area"]}>
          <Viewer content={apply.content} height="100%" />
        </section>
        <SubmitList applyId={applyId} />
      </article>
    </>
  );
}
