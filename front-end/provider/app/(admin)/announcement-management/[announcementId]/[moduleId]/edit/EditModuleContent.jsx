"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateModule } from "../../../actions";

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
      {pending ? "작업을 저장하는 중입니다..." : "저장하기"}
    </button>
  );
};

export default function EditModuleContent({
  module: {
    postingId,
    detailId,
    title,
    description,
    rewardToken,
    rewardAmount,
    ...module
  },
  coinList,
}) {
  const editorRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (moduleData) => {
    const { editorInstance } = editorRef.current;

    try {
      await updateModule({
        postingId,
        detailId,
        title: moduleData.get("title"),
        description: editorInstance.getMarkdown(),
        rewardToken: moduleData.get("rewardToken"),
        rewardAmount: moduleData.get("rewardAmount"),
        module,
      });

      router.back();
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form className="frame-116" action={handleSubmit}>
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
        <label className="h5-18 color-gray-03" htmlFor="rewardToken">
          토큰
        </label>
        <select
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          name="rewardToken"
          id="rewardToken"
          defaultValue={rewardToken}
        >
          {coinList.map(({ coin, id }) => (
            <option key={id} value={id}>
              {coin.name}
            </option>
          ))}
        </select>
      </div>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="rewardAmount">
          금액
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="number"
          name="rewardAmount"
          id="rewardAmount"
          defaultValue={rewardAmount}
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor editorRef={editorRef} content={description} height="100%" />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
