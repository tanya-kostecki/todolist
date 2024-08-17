import React, { useState, ChangeEvent, KeyboardEvent, memo } from "react";
import TextField from "@mui/material/TextField";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import { unwrapResult } from "@reduxjs/toolkit";
import { RejectActionError } from "common/types";

type Props = {
  addItem: (title: string) => Promise<any>;
  disabled?: boolean;
};
export const AddItemForm = memo(({ addItem, disabled }: Props) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const addItemHandler = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle !== "") {
      addItem(trimmedTitle)
        .then(unwrapResult)
        .then(() => setNewTaskTitle(""))
        .catch((error: RejectActionError) => {
          if (error.type === "appError") {
            setError(error.error?.messages[0]);
          }
        });
    } else {
      setError("Title is required");
    }
  };

  const changeTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.currentTarget.value);
  };

  const addItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null);
    if (event.key === "Enter") addItemHandler();
  };

  return (
    <div>
      <TextField
        label="Enter a title"
        variant={"outlined"}
        className={error ? "error" : ""}
        error={!!error}
        value={newTaskTitle}
        size={"small"}
        onChange={changeTaskTitle}
        onKeyUp={addItemOnEnterHandler}
        helperText={error}
        disabled={disabled}
      />
      <IconButton onClick={addItemHandler} color={"primary"} disabled={disabled}>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
});
