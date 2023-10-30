import Link from "next/link";
import { useEffect } from "react";

export default function Main() {
  return <>
    <article style={{display: "flex", flexDirection: "column"}}>
      <Link href={"/mission"}>미션</ Link>
      <Link href={"/article"}>아티클</ Link>
    </article>
  </>
}