import { AddItemForm, AddItemFormProps } from "../components/AddItemForm";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";

const meta: Meta<typeof AddItemForm> = {
  title: "TODOLISTS/AddItemForm",
  component: AddItemForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    addItem: {
      description: "Button clicked inside form",
    },
  },
  args: { addItem: fn() },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

export const AddItemFormStory: Story = {};

export const AddItemFormErrorStory = (props: AddItemFormProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>("Title is required");

  function addItemHandler() {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle !== "") {
      props.addItem(trimmedTitle);
      setNewTaskTitle("");
    } else {
      setError("Title is required");
    }
  }

  function changeTaskTitle(event: ChangeEvent<HTMLInputElement>) {
    setNewTaskTitle(event.currentTarget.value);
  }

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
      <IconButton onClick={addItemHandler} color={"primary"}>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
};
