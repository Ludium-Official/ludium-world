"use client";

import { allocateCoWorker, releaseCoWorker } from "@/app/actions/work";
import { ClientSideDataGrid } from "@/components/ClientSideComponent";
import Button from "@/components/datagrid/Button";
import { ProfileLink } from "@/components/datagrid/Link";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function CoWorkerDataGrid({ workId, coWorkers, users }) {
  const router = useRouter();
  const allocateCoWorkerFormRef = useRef();
  const releaseCoWorkerFormRef = useRef();

  const setWorkerPermission = async ({ id }) => {
    const { usrId } = allocateCoWorkerFormRef.current;
    usrId.value = id;

    allocateCoWorkerFormRef.current.requestSubmit();
  };

  const handleAllocateCoWorker = async (allocateCoWorkerFormData) => {
    try {
      await allocateCoWorker({
        workId,
        usrId: allocateCoWorkerFormData.get("usrId"),
      });
      allocateCoWorkerFormData.set("usrId", "");
      alert("공동 작업자 권한을 할당했습니다");
    } catch ({ message }) {
      alert(message);
    }
  };

  const deleteWorkerPermission = async ({ usrId }) => {
    releaseCoWorkerFormRef.current.usrId.value = usrId;

    releaseCoWorkerFormRef.current.requestSubmit();
  };

  const handleReleaseCoWorker = async (releaseCoWorkerFormData) => {
    try {
      await releaseCoWorker({
        workId,
        usrId: releaseCoWorkerFormData.get("usrId"),
      });
      releaseCoWorkerFormData.set("usrId", "");
      alert("공동 작업자 권한을 해제했습니다");
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <>
      <h2 className="h3-24">공동 작업자</h2>
      <ClientSideDataGrid
        columns={[
          {
            header: "닉네임",
            name: "nick",
            renderer: {
              type: ProfileLink,
              options: {
                path: "profile",
                text: "nick",
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
      <form ref={allocateCoWorkerFormRef} action={handleAllocateCoWorker}>
        <input type="hidden" name="usrId" />
      </form>
      <h2 className="h3-24">회원 목록</h2>
      <ClientSideDataGrid
        columns={[
          {
            header: "닉네임",
            name: "nick",
            renderer: {
              type: ProfileLink,
              options: {
                path: "profile",
                text: "nick",
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
      <form ref={releaseCoWorkerFormRef} action={handleReleaseCoWorker}>
        <input type="hidden" name="usrId" />
      </form>
    </>
  );
}
