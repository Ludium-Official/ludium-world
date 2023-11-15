import { useEffect, useRef, useState } from "react";
import Editor from "../../../../../components/Editor";
import fetchWithRetry from "../../../../../functions/api";
import "tui-grid/dist/tui-grid.css";

class CustomButtonRenderer {
    constructor(props) {
        this.el = document.createElement('button');
        this.el.onclick = () => {
            props.columnInfo.renderer.options.onClick(props.grid.getRow(props.rowKey));
        };
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        const textValue = props.columnInfo.renderer.options.getTextValue(props.value);
        this.el.innerText = textValue;
    }
}

export async function getServerSideProps(context) {
    const { courseId, moduleId } = context.query;

    const getModuleResponse = await fetchWithRetry(`/course/${courseId}/${moduleId}`);

    return {
        props: {
            module: await getModuleResponse.json(),
            courseId,
            moduleId,
        }
    }
}

export default function EditModule({ module, courseId, moduleId }) {
    const editorRef = useRef(null);
    const gridRef = useRef(null);
    const [missionAndArticles, setMissionAndArticles] = useState([]);

    const handleFetchMissionAndArticle = async () => {
        const getAllMissionAndArticlesResponse = await fetchWithRetry(`/course/missionAndArticles/${moduleId}`);

        setMissionAndArticles(await getAllMissionAndArticlesResponse.json());
    }

    const handleEditReference = async ({ id }) => {
        
    }

    const getTextValue = value => {
        return value ? "적용 해제 하기" : "적용 하기";
    }

    useEffect(() => {
        const getGrid = async () => {
            const Grid = (await import("tui-grid")).default;

            if (!gridRef.current.instance) {
                const grid = new Grid({
                    el: gridRef.current,
                    columns: [
                        {
                            header: "제목",
                            name: "title",
                        },
                        {
                            header: "카테코리",
                            name: "category"
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
                                    getTextValue
                                }
                            }
                        }
                    ],
                    data: missionAndArticles
                });

                gridRef.current.instance = grid;
            } else {
                gridRef.current.instance.resetData(missionAndArticles);
            }

            Grid.applyTheme("striped");
        }

        getGrid();
    }, [missionAndArticles]);

    return <>
        <input type="text" defaultValue={module.title} />
        <input type="text" defaultValue={module.category} placeholder="카테고리를 입력해주세요" />
        <hr />
        <h1>모듈 참고 링크</h1>
        <button onClick={handleFetchMissionAndArticle}>미션, 아티클 불러오기</button>
        <div ref={gridRef} className="ref-grid"></div>
        {module.moduleReferences.map(moduleReference => <p>{moduleReference.artId}</p>)}
        <hr />
        <Editor editorRef={editorRef} content={module.content} />
    </>;
}