import { useEffect, useRef, useState } from "react";
import { AffineSchemas } from '@blocksuite/blocks/models';
import { Schema, Workspace, Text } from '@blocksuite/store';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

export default function NewArticle() {
  const schema = new Schema();
  schema.register(AffineSchemas);
  
  const divRef = useRef(null);
  const [workspace, setWorkspace] = useState(null);
  const [page, setPage] = useState(null);
  
  const getEditor = async (parent) => {
    const { EditorContainer } = await import('@blocksuite/editor');
    const workspace = new Workspace({ id: 'ludium', schema });
    const page = workspace.createPage({ id: 'new-page' });

    const editor = new EditorContainer();
    editor.page = page;

    page.waitForLoaded().then(() => {
      const pageBlockId = page.addBlock('affine:page', { title: new Text('') });
      const noteId = page.addBlock('affine:note', {}, pageBlockId);
      page.addBlock('affine:paragraph', {}, noteId);
    });

    parent.innerText = '';
    parent.appendChild(editor);

    setWorkspace(workspace);
    setPage(page);
  }

  const handleSave = _ => {
    const binary = Y.encodeStateAsUpdate(workspace.doc);
    const binaryString = Array.from(binary).map(byte => String.fromCharCode(byte)).join('');
    localStorage.setItem('savedData', binaryString);
  }

  const handleLoad = _ => {
    const binaryString = localStorage.getItem('savedData');
    if (binaryString) {
      const binary = new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
      if (workspace) {
        Y.applyUpdate(workspace.doc, binary);
      }
    } else {
      console.error('No data found in localStorage');
    }
  }

  const toggleReadOnly = _ => {
    page.awarenessStore.setReadonly(page, !page.readonly);
  }

  useEffect(() => {
    getEditor(divRef.current)
  }, []);

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
      <button onClick={toggleReadOnly}>Toggle Read Only</button>
      <div ref={divRef} style={{ width: '100%', height: '100vh' }}>Loading...</div>
    </>
  )
}