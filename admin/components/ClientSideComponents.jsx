import dynamic from "next/dynamic";

export const ClientSideDataGrid = dynamic(
  () => import("@/components/DataGrid"),
  { ssr: false }
);
