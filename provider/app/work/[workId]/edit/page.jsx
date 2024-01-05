import fetchWithRetry from "../../../../functions/api";
import MakeForm from "./MakeForm";

async function getModule(moduleId) {
    const getModuleResponse = await fetchWithRetry(`/module/${moduleId}`);

    return await getModuleResponse.json();
}

async function getMake(makeId) {
    const getMakeResponse = await fetchWithRetry(`/article/${makeId}`);

    if(!getMakeResponse.ok){
        return null;
    }

    return await getMakeResponse.json();
}

export default async function MakeEditPage({ params: { makeId } }) {
    const { title } = await getModule(makeId);

    const make = await getMake(makeId);

    return <MakeForm id={makeId} title={title} content={make === null ? "": make.content} shareable={make === null? false: true}  />;
}