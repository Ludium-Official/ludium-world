"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";

const key = process.env.NEXT_PUBLIC_IMGBB_KEY;

export async function uploadImage(formData) {
  formData.append("key", key);

  const uploadResponse = await fetch(`https://api.imgbb.com/1/upload`, {
    method: HTTP_METHOD.POST,
    body: formData,
  });

  if (!uploadResponse.ok) return false;

  const {
    data: { url },
  } = await uploadResponse.json();

  return url;
}
