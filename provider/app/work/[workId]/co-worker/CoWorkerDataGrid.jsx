"use client";

import { ClientSideDataGrid } from "@/components/ClientSideComponent";
import Button from "@/components/datagrid/Button";
import DynamicLink from "@/components/datagrid/Link";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";

export default function CoWorkerDataGrid({ workId, coWorkers, users }) {
  const router = useRouter();
  const setWorkerPermission = async ({ id }) => {
    const createWorkerPermissionResponse = await fetchWithRetry(
      `/detailed-announcement/${workId}/co-worker`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          detailId: workId,
          usrId: id,
        }),
      }
    );

    if (!createWorkerPermissionResponse.ok) {
      alert("권한을 할당하는 중 에러가 발생했습니다.");
    }

    alert("권한을 할당했습니다");

    router.refresh();
  };

  const deleteWorkerPermission = async ({ usrId }) => {
    const deleteWorkerPermissionResponse = await fetchWithRetry(
      `/detailed-announcement/${workId}/co-worker/${usrId}`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    if (!deleteWorkerPermissionResponse.ok) {
      alert("권한을 해제하는 중 에러가 발생했습니다.");
    }

    alert("권한을 해제했습니다");

    router.refresh();
  };

  return (
    <>
      <h2 className="h3-24">공동 작업자</h2>
      <ClientSideDataGrid
        columns={[
          {
            header: "닉네임",
            name: "nick",
          },
          {
            header: "프로필",
            name: "profile",
            width: 120,
            align: "center",
            renderer: {
              type: DynamicLink,
              options: {
                href: "/profile/$",
                text: "프로필 보기",
                key: ["usrId"],
              },
            },
          },
          {
            header: "공동 작업자 권한",
            name: "permission",
            width: 120,
            align: "center",
            renderer: {
              type: Button,
              options: {
                text: "권한 해제",
                onClick: deleteWorkerPermission,
              },
            },
          },
        ]}
        data={coWorkers}
      />
      <h2 className="h3-24">회원 목록</h2>
      <ClientSideDataGrid
        columns={[
          {
            header: "닉네임",
            name: "nick",
          },
          {
            header: "프로필",
            name: "profile",
            width: 120,
            align: "center",
            renderer: {
              type: DynamicLink,
              options: {
                href: "/profile/$",
                text: "프로필 보기",
                key: ["id"],
              },
            },
          },
          {
            header: "공동 작업자 권한",
            name: "permission",
            width: 120,
            align: "center",
            renderer: {
              type: Button,
              options: {
                text: "권한 할당",
                onClick: setWorkerPermission,
              },
            },
          },
        ]}
        data={users}
      />
    </>
  );
}
