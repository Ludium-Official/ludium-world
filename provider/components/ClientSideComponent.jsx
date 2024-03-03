import dynamic from "next/dynamic";

export const ClientSideDataGrid = dynamic(() => import("./DataGrid"), {
  ssr: false,
});
