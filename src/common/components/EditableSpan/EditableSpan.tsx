import React, { ChangeEvent, memo, useState } from "react";
import TextField from "@mui/material/TextField";

type Props = {
  oldTitle: string;
  updateTitle: (newTitle: string) => void;
  disabled?: boolean;
};
export const EditableSpan = ({ oldTitle, updateTitle, disabled}: Props) => {
  const [editable, setEditable] = useState(false);
  const [newTitle, setNewTitle] = useState(oldTitle);

  const editHandler = () => {
    if (!disabled) {
      setEditable(!editable);
      if (editable) {
        updateTitleHandler();
      }
    }
  };

  const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value);
  };

  const updateTitleHandler = () => {
    updateTitle(newTitle.trim());
  };

  return editable ? (
    <TextField
      label="Enter a title"
      variant={"outlined"}
      value={newTitle}
      size={"small"}
      onChange={changeTitleHandler}
      onBlur={editHandler}
      autoFocus
    />
  ) : (
    <span onDoubleClick={editHandler}>{oldTitle}</span>
  );
};
