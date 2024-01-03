import AnnouncementPage from "./announcement/page";
// import MyMakePage from "./make/MyMake";

export const metadata = {
  title: "Ludium",
};

export default function Page() {
  return (
    <>
      <AnnouncementPage />
      {/* <MyMakePage /> */}
    </>
  );
}
