import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { FilterButtonContainerSx } from "features/TodolistPage/ui/Todolist/TodoList";
import { FilterValuesType } from "app/ui/App";
import { TodolistDomainType, todolistsActions } from "features/TodolistPage/model/todolistsSlice";
import { useAppDispatch } from "app/model/store";

type Props = {
  todolist: TodolistDomainType;
};
export const FilterButtons = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();
  const changeTodolistFilterHandler = (filter: FilterValuesType) => {
    dispatch(todolistsActions.changeFilter({ id: todolist.id, filter }));
  };
  return (
    <Box sx={FilterButtonContainerSx}>
      <Button
        variant={todolist.filter === "all" ? "contained" : "text"}
        color="secondary"
        onClick={() => changeTodolistFilterHandler("all")}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "contained" : "text"}
        color="error"
        onClick={() => changeTodolistFilterHandler("active")}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "contained" : "text"}
        color="primary"
        onClick={() => changeTodolistFilterHandler("completed")}
      >
        Completed
      </Button>
    </Box>
  );
};
