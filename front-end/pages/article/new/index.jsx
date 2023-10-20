import { useEffect, useRef } from "react"

const getEditor = async (parent) => {
  const { SimpleAffineEditor } = await import('@blocksuite/editor');
  const editor = new SimpleAffineEditor();

  parent.innerText = '';
  parent.appendChild(editor);
}

export default function NewArticle() {
  const divRef = useRef(null);

  useEffect(_ => {
    getEditor(divRef.current)
  }, []);

  return (
    <>
      <button>업로드</button>
      <div ref={divRef}>로딩중</div>
    </>
  )
}