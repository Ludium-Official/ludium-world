"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";

export default function ModuleOrderNoForm({ moduleId, orderNo }) {
  const router = useRouter();
  const handleUpdateOrderNo = async (e) => {
    e.preventDefault();
    const moduleFormData = new FormData(e.target);
    const updateModuleOrderNoResponse = await fetchWithRetry(
      `/module/${moduleId}/order`,
      {
        method: "PUT",
        body: moduleFormData,
      }
    );

    if (updateModuleOrderNoResponse.ok) {
      alert("모듈의 순서를 변경했습니다.");
      router.refresh();
    }
  };
  return (
    <form onSubmit={handleUpdateOrderNo}>
      <input type="number" name="orderNo" id="orderNo" defaultValue={orderNo} />
      <button>순서 변경하기</button>
    </form>
  );
}
