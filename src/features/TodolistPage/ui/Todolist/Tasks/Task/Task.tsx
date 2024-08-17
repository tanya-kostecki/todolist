import React, { ChangeEvent } from "react";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditableSpan } from "common/components";
import { TaskStatuses } from "common/enum";
import { TaskType } from "features/TodolistPage/api/tasksApi.types";
import { useAppDispatch } from "app/model/store";
import { deleteTask, updateTask } from "features/TodolistPage/model/tasksSlice";
import s from "./Task.module.css";

type Props = {
  task: TaskType;
  disabled?: boolean;
};
export const Task = ({ task, disabled }: Props) => {
  const dispatch = useAppDispatch();

  const updateTaskTitleHandler = (title: string) => {
    dispatch(updateTask({ taskId: task.id, domainModel: { title }, todolistId: task.todoListId }));
  };

  const removeTaskHandler = () => {
    dispatch(deleteTask({ todolistId: task.todoListId, taskId: task.id }));
  };

  const changeTaskStatusHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const status = event.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    dispatch(updateTask({ taskId: task.id, todolistId: task.todoListId, domainModel: { status } }));
  };

  let checked = task.status === TaskStatuses.Completed;
  let isDisabled = disabled || task.entityStatus === "loading";

  return (
    <div className={checked ? s.isDone : ""}>
      <Checkbox checked={checked} onChange={changeTaskStatusHandler} disabled={isDisabled} />
      <EditableSpan oldTitle={task.title} updateTitle={updateTaskTitleHandler} disabled={isDisabled} />
      <IconButton
        aria-label="delete"
        onClick={removeTaskHandler}
        disabled={disabled || task.entityStatus === "loading"}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
