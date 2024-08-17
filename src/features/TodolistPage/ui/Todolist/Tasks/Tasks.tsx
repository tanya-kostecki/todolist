import React, { useMemo } from "react";
import List from "@mui/material/List";
import { Task } from "features/TodolistPage/ui/Todolist/Tasks/Task/Task";
import { TaskStateType } from "app/ui/App";
import { TodolistDomainType } from "features/TodolistPage/model/todolistsSlice";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/model/store";
import { selectTasks } from "features/TodolistPage/model/tasksSlice";

type Props = {
  todolist: TodolistDomainType;
};
export const Tasks = ({ todolist }: Props) => {
  const tasks = useSelector<AppRootStateType, TaskStateType>(selectTasks);
  let filteredTasks = tasks[todolist.id];

  filteredTasks = useMemo(() => {
    if (todolist.filter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.status === 2);
    }
    if (todolist.filter === "active") {
      filteredTasks = filteredTasks.filter((task) => task.status === 0);
    }
    return filteredTasks;
  }, [tasks, todolist.filter]);

  return (
    <List>
      {filteredTasks.map((task) => {
        return <Task key={task.id} task={task} disabled={task.entityStatus === "loading"} />;
      })}
    </List>
  );
};
