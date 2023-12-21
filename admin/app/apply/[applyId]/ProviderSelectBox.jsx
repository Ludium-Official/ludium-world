"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";
import applystyle from "../apply.module.css";

export default function ProviderSelectBox({ moduleId, makeId, submits }) {
  const router = useRouter();

  const handleChangeProvider = async ({ target }) => {
    if(target.value === "") return;
    
    const changeProviderResponse = await fetchWithRetry(
      `/module/${moduleId}/${makeId}/${target.value}`,
      {
        method: "PUT"
      }
    );

    if (!changeProviderResponse.ok) {
      alert("제작자 권한을 할당하지 못했습니다.");
      return;
    }

    alert("제작자 권한을 할당했습니다.");
    router.refresh();
  };

  return (
    <select
      className={applystyle["make-list-column"]}
      name="provider"
      id="provider"
      onChange={handleChangeProvider}
    >
      <option value="">제작 지원자를 선택해주세요.</option>
      {submits.map(({ usrId, nick }) => (
        <option value={usrId} key={usrId}>
          {nick}
        </option>
      ))}
    </select>
  );
}
