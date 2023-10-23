import Link from "next/link";
import { useEffect } from "react";

export default function Main() {
  useEffect(_ => {
    const userInfo = async () => {
      const { value } = await cookieStore.get("access_token");

      const info = await fetch("http://localhost:8080/auth/google/info/google", {
        headers: {
          Authorization: `Bearer${value}`
        }
      })

      const {email, given_name, id, name} = await info.json();

      console.log({ email, given_name, id, name });
    }

    userInfo();
  }, []);

  return <Link href={"/article"}>아티클</ Link>
}