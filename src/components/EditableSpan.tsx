import React, { ChangeEvent, useState } from "react";

type EditableSpanProps = {
  oldTitle: string;
  updateTitle: (newTitle: string) => void
};
export const EditableSpan = (props: EditableSpanProps) => {
  const [editable, setEditable] = useState(false);
  const [newTitle, setNewTitle] = useState(props.oldTitle);

  const editHandler = () => {
    setEditable(!editable)
    if (editable) {
        updateTitleHandler()
    }
};
  const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value);
  };

const updateTitleHandler = () => {
    props.updateTitle(newTitle.trim())
}

  return editable ? (
    <input
      value={newTitle}
      onChange={changeTitleHandler}
      autoFocus
      onBlur={editHandler}
    />
  ) : (
    <span onDoubleClick={editHandler}>{props.oldTitle}</span>
  );
};
