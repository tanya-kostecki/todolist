import React, { ChangeEvent, memo, useState } from "react";
import TextField from '@mui/material/TextField';

type EditableSpanProps = {
  oldTitle: string;
  updateTitle: (newTitle: string) => void
};
export const EditableSpan = memo((props: EditableSpanProps) => {
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
    // <input
    //   value={newTitle}
    //   onChange={changeTitleHandler}
    //   autoFocus
    //   onBlur={editHandler}
    // />
    <TextField
        label="Enter a title"
        variant={'outlined'}
        value={newTitle}
        size={'small'}
        onChange={changeTitleHandler}
        onBlur={editHandler}
        autoFocus
      />
  ) : (
    <span onDoubleClick={editHandler}>{props.oldTitle}</span>
  );
});
