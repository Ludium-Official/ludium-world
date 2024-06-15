"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("ggl_id");

  redirect("/");
}
