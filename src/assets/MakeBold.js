import {
  ContentBlock,
  ContentState,
  EditorState,
  SelectionState,
} from "draft-js";

export const handleBold = (selectionState,contentState, block,text,blockKey,editorState) => {
  const blockSelection = selectionState.merge({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: text.indexOf(" ") + 1,
  });
  
  const updatedContentState = contentState.merge({
    //@ts-ignore
    blockMap: contentState.getBlockMap().merge({
      [blockKey]: block.merge({
        type: "block-bold",
        text: text.slice(2),
      }),
    }),
  });
  const newEditorState = EditorState.push(
    editorState,
    //@ts-ignore
    updatedContentState,
    "change-block-data"
  );
  return EditorState.forceSelection(newEditorState, blockSelection);
};
