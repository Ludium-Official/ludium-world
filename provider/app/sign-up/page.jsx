import fetchWithRetry from "../../functions/api"
import SignUp from "./SignUp"

export const metadata = {
    title: "내 정보 입력"
}

async function getApply() {
    const applyResponse = await fetchWithRetry("/apply");

    if(!applyResponse.ok) return null;

    return await applyResponse.json();
}

export default async function SignUpPage() {
    const apply = await getApply();

    return <SignUp apply={apply} />
}  