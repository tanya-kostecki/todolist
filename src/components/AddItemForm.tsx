import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "./button/Button";

type AddItemFormProps = {
  addItem: (title: string) => void;
};
export const AddItemForm = (props: AddItemFormProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const addTaskHandler = () => {
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

  const addTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (event.key === "Enter") addTaskHandler();
  };
  return (
    <div>
      <input
        className={error ? "error" : ""}
        value={newTaskTitle}
        onChange={changeTaskTitle}
        onKeyUp={addTaskOnEnterHandler}
      />
      <Button title="+" onClick={addTaskHandler} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
