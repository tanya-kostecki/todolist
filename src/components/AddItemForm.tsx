import React, { useState, ChangeEvent, KeyboardEvent, memo } from "react";
import TextField from "@mui/material/TextField";
import AddBoxIcon from '@mui/icons-material/AddBox'
import IconButton from '@mui/material/IconButton'

type AddItemFormProps = {
  addItem: (title: string) => void;
};
export const AddItemForm = memo((props: AddItemFormProps) => {
  // console.log('AddItemForm')
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const addItemHandler = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle !== "") {
      props.addItem(trimmedTitle);
      setNewTaskTitle("");
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
      />
      <IconButton onClick={addItemHandler} color={'primary'}>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
})
