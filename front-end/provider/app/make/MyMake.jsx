import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import makestyle from "./make.module.css";
import { cookies } from "next/headers";

async function getMyMake() {
  const getMyMakeResponse = await fetchWithRetry("/make/own", {
    headers: {
      cookie: cookies(),
    },
  });

  if (!getMyMakeResponse.ok) return [];

  return await getMyMakeResponse.json();
}

export default async function MyMakePage() {
  const makes = await getMyMake();

  return (
    <article className={makestyle.wrapper}>
      <h1 className={makestyle["title-label"]}>내 제작 목록</h1>
      <section className={makestyle["make-list"]}>
        {makes.map(({ id, title }) => (
          <h2 className={makestyle["make-list-item"]} key={crypto.randomUUID()}>
            <Link href={`/make/${id}`}>{title}</Link>
          </h2>
        ))}
      </section>
    </article>
  );
}
