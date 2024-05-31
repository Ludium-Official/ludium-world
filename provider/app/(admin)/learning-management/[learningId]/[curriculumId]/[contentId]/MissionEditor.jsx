"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateMission } from "../../../actions";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "미션을 수정하는 중입니다..." : "미션 수정하기"}
    </button>
  );
};

export default function MissionEditor({
  mission: { title, orderNum, description, missionSubmitForm, ...mission },
  postingId,
}) {
  const editorRef = useRef();
  const submitFormEditorRef = useRef();

  const handleEditWorkContent = async (missionData) => {
    const { editorInstance } = editorRef.current;
    const submitFormEditorInstance = submitFormEditorRef.current.editorInstance;

    try {
      await updateMission({
        postingId,
        title: missionData.get("title"),
        description: editorInstance.getMarkdown(),
        missionSubmitForm: submitFormEditorInstance.getMarkdown(),
        orderNum: missionData.get("orderNum"),
        mission,
      });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form className="frame-116" action={handleEditWorkContent}>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="title">
          제목
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="text"
          name="title"
          id="title"
          defaultValue={title}
          placeholder="미션 제목을 입력해주세요"
        />
      </div>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="orderNum">
          순번
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="number"
          name="orderNum"
          id="orderNum"
          defaultValue={orderNum}
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor editorRef={editorRef} content={description} height="100%" />
        </div>
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">제출 양식</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor
            editorRef={submitFormEditorRef}
            content={missionSubmitForm}
            height="100%"
          />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
