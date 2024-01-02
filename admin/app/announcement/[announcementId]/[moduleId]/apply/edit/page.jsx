import fetchWithRetry from "@/functions/api";
import { getApply, getSubmitApplyReference } from "../page";
import EditApplyForm from "./EditApplyForm";

async function getSubmit(applyId, submitId) {
  const getSubmitResponse = await fetchWithRetry(
    `/apply/${applyId}/submit/${submitId}`
  );

  if (!getSubmitResponse.ok) return null;

  return await getSubmitResponse.json();
}

export default async function EditApply({ params: { moduleId } }) {
  const { id } = await getApply(moduleId);

  const submitReference = await getSubmitApplyReference(id);

  const submit = await getSubmit(id, submitReference.sbmId);

  return <EditApplyForm submit={submit} applyId={id} />;
}
