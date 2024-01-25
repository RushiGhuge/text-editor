import React, { useEffect, useRef } from "react";
import "./App.css";
import {
  ContentBlock,
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { handleBold } from "./assets/MakeBold";
import { handelUnderline } from "./assets/MakeUnderline";
import { handleRed } from "./assets/MakeRad";
import { handleHeading } from "./assets/MakeHeading";

function App() {

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const childRef = useRef(null);

  useEffect(() => {
    let localItem = localStorage.getItem("editorContext");
    if (localItem) {
      const context = convertFromRaw(JSON.parse(localItem));
      console.log(context.toObject());
      setEditorState(EditorState.createWithContent(context));
    }
  }, []);



  const handleChange = (editorState) => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = block.getKey();
    console.log(block.toObject());


    if (text.startsWith("# ")) {
      const newEditorState = handleHeading(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("*** ")) {
      console.log(text);
      const newEditorState = handelUnderline(selectionState, contentState, block, text, blockKey, editorState);
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("** ")) {
      const newEditorState = handleRed(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("* ")) {
      const newEditorState = handleBold(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    }
    setEditorState(editorState);

    return false;
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(
      "editorContext",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
      alert('File Saved!')
  };


  function myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === "block-bold") {
      return "BoldBlock";
    }
    if (type === "block-red") {
      return "RedBlock";
    }
    if (type === "block-underline") {
      return "UnderlineBlock";
    }
  }


  return (
    <div className="container">
      <div className="heading">
        <span></span>
        <h3>Demo editor by 😎 'Rushikesh Ghuge'!</h3>
        <button onClick={handleSave} className="save-btn">Save</button>
      </div>

      <div
        onClick={() => {
          //@ts-ignore
          childRef.current && childRef.current.focus();
        }}

        className="editor-container"
      >
        <Editor
          ref={childRef}
          editorState={editorState}
          onChange={handleChange}
          //@ts-ignore
          blockStyleFn={myBlockStyleFn}
        />
      </div>
    </div>
  );
}

export default App;
