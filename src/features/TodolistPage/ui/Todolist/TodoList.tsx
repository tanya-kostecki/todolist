import React from "react";
import { SxProps } from "@mui/material";
import { AddItemForm } from "common/components";
import { TodolistDomainType } from "features/TodolistPage/model/todolistsSlice";
import { addTask } from "features/TodolistPage/model/tasksSlice";
import { useAppDispatch } from "app/store";
import { Tasks } from "features/TodolistPage/ui/Todolist/Tasks/Tasks";
import { FilterButtons } from "features/TodolistPage/ui/Todolist/FilterButtons/FilterButtons";
import { TodolistTitle } from "features/TodolistPage/ui/Todolist/TodolistTitle/TodolistTitle";

export const FilterButtonContainerSx: SxProps = { display: "flex", justifyContent: "space-between" };

type Props = {
  todolist: TodolistDomainType;
};

export const TodoList = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();

  const addTaskHandler = (title: string) => {
    dispatch(addTask({ todolistId: todolist.id, title }));
  };

  return (
    <>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </>
  );
};
