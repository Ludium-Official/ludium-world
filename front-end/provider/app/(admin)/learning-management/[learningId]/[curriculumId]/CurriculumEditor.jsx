"use client";

import { useFormStatus } from "react-dom";
import { updateCurriculum } from "../../actions";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "커리큘럼을 수정하는 중입니다..." : "커리큘럼 수정하기"}
    </button>
  );
};

export default function CurriculumEditor({
  curriculum: { title, orderNum, ...curriculum },
}) {
  const handleEditWorkContent = async (curriculumData) => {
    try {
      await updateCurriculum({
        title: curriculumData.get("title"),
        orderNum: curriculumData.get("orderNum"),
        curriculum,
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
          placeholder="제목을 입력해주세요"
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
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
