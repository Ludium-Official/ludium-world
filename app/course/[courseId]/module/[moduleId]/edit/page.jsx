import fetchWithRetry from "../../../../../../functions/api";
import EditModuleContent from "./EditModuleContent";

class CustomButtonRenderer {
  constructor(props) {
    this.el = document.createElement("button");
    this.el.onclick = () => {
      props.columnInfo.renderer.options.onClick(
        props.grid.getRow(props.rowKey)
      );
    };
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const textValue = props.columnInfo.renderer.options.getTextValue(
      props.value
    );
    this.el.innerText = textValue;
  }
}

async function getModule(courseId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/course/${courseId}/${moduleId}`
  );

  if (!getModuleResponse.ok) return null;

  return await getModuleResponse.json();
}

async function getArticle(moduleId) {
  const getAllMissionAndArticlesResponse = await fetchWithRetry(
    `/course/missionAndArticles/${moduleId}`
  );

  if (!getAllMissionAndArticlesResponse.ok) return [];

  return await getAllMissionAndArticlesResponse.json();
}

export default async function EditModulePage({
  params: { courseId, moduleId },
}) {
  const module = await getModule(courseId, moduleId);
  const articles = await getArticle(moduleId);

  return (
    <EditModuleContent
      module={module}
      articles={articles}
      courseId={courseId}
      moduleId={moduleId}
    />
  );
}
