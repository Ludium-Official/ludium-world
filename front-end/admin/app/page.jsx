import homestyle from "./home.module.css";

export const metadata = {
  title: "Ludium",
};

export default function Page() {
  return (
    <article className={homestyle["home-wrapper"]}>
      <h1>루디움 메인 페이지</h1>
    </article>
  );
}
