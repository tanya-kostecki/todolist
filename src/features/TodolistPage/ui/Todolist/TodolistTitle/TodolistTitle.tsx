import React from "react";
import { EditableSpan } from "common/components";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { changeTodolistTitle, deleteTodolist, TodolistDomainType } from "features/TodolistPage/model/todolistsSlice";
import { useAppDispatch } from "app/store";

type Props = {
  todolist: TodolistDomainType;
};
export const TodolistTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();

  const removeTodolistHandler = () => {
    dispatch(deleteTodolist({ todolistId: todolist.id }));
  };

  const updateTodolistTitleHandler = (title: string) => {
    dispatch(changeTodolistTitle({ todolistId: todolist.id, title }));
  };

  return (
    <h3>
      <EditableSpan
        oldTitle={todolist.title}
        updateTitle={updateTodolistTitleHandler}
        disabled={todolist.entityStatus === "loading"}
      />
      <IconButton aria-label="delete" onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </h3>
  );
};
