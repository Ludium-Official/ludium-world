"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "tui-grid/dist/tui-grid.css";
import Editor from "../../../../../../components/Editor";
import fetchWithRetry from "../../../../../../functions/api";
import coursestyle from "../../../../course.module.css";

class CustomButtonRenderer {
  constructor(props) {
    this.el = document.createElement("button");
    this.el.type = "button";
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

export default function EditModuleContent({
  module,
  articles,
  courseId,
  moduleId,
}) {
  const editorRef = useRef(null);
  const gridRef = useRef(null);
  const [missionAndArticles, setMissionAndArticles] = useState(articles);
  const router = useRouter();

  const handleFetchMissionAndArticle = async () => {
    const getAllMissionAndArticlesResponse = await fetchWithRetry(
      `/course/missionAndArticles/${moduleId}`
    );

    setMissionAndArticles(await getAllMissionAndArticlesResponse.json());
  };

  const handleEditReference = async ({ id }) => {
    const getModuleResponse = await fetchWithRetry(
      `/course/${courseId}/${moduleId}/${id}`,
      {
        method: "PUT",
      }
    );

    if (getModuleResponse.ok) {
      handleFetchMissionAndArticle();
      router.refresh();
    }
  };

  const getTextValue = (value) => {
    return value ? "적용 해제 하기" : "적용 하기";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { editorInstance } = editorRef.current;

    formData.append("content", editorInstance.getMarkdown());

    const editModuleResponse = await fetchWithRetry(
      `/course/${courseId}/module/${moduleId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (editModuleResponse.ok) {
      router.push(`/course/${courseId}/module/${moduleId}`);
      router.refresh();
    }
  };

  useEffect(() => {
    const getGrid = async () => {
      const Grid = (await import("tui-grid")).default;

      if (!gridRef.current.instance) {
        const grid = new Grid({
          el: gridRef.current,
          bodyHeight: "fitToParent",
          columns: [
            {
              header: "제목",
              name: "title",
            },
            {
              header: "카테코리",
              name: "category",
            },
            {
              header: " ",
              name: "checked",
              width: 120,
              align: "center",
              renderer: {
                type: CustomButtonRenderer,
                options: {
                  onClick: handleEditReference,
                  getTextValue,
                },
              },
            },
          ],
          data: missionAndArticles,
        });

        gridRef.current.instance = grid;
      } else {
        gridRef.current.instance.resetData(missionAndArticles);
      }

      Grid.applyTheme("striped");
    };

    getGrid();
  }, [missionAndArticles]);

  const handleBack = () => {
    router.push(`/course/${courseId}/module/${moduleId}`);
  }

  return (
    <form className={`${coursestyle["course-edit-wrapper"]} ${coursestyle["form-wrapper"]}`} onSubmit={handleSubmit}>
      <div className={coursestyle["course-edit-button-area"]}>
        <button className={coursestyle["course-edit-button"]} type="button" onClick={handleBack}>돌아가기</button>
        <input
          className={coursestyle["course-edit-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={coursestyle["course-edit-header-area"]}>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={module.title}
          placeholder="제목을 입력해주세요"
        />
        <input
          type="text"
          name="category"
          id="category"
          defaultValue={module.category}
          placeholder="카테고리를 입력해주세요"
        />
      </div>
      <div className={coursestyle["course-edit-reference-area"]}>
        <h1>모듈 참고 링크</h1>
        <div className={coursestyle["course-edit-reference-button-area"]}>
          <button type="button" onClick={handleFetchMissionAndArticle}>
            미션, 아티클 불러오기
          </button>
        </div>
        <div className={coursestyle["ref-grid"]}>
          <div ref={gridRef} />
        </div>
      </div>
      <div className={coursestyle["course-edit-content-area"]}>
        <Editor editorRef={editorRef} content={module.content} height={"100%"} />
      </div>
    </form>
  );
}
