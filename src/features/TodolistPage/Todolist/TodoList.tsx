import React, { memo, useCallback, useMemo } from "react";
import { FilterValuesType } from "app/App";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button, { ButtonProps } from "@mui/material/Button";
import List from "@mui/material/List";
import { Box } from "@mui/material";
import { FilterButtonContainerSx } from "features/TodolistPage/Todolist/Todolist.styles";
import { Task } from "features/TodolistPage/Todolist/Task/Task";
import { TaskType } from "features/TodolistPage/Todolist/todolistApi";
import { useAppDispatch } from "app/store";
import { RequestStatusType } from "app/appSlice";
import { AddItemForm, EditableSpan } from "common/components";
import { TaskStatuses } from "common/enum";

type TodoListPropsType = {
  todolistID: string;
  tasks: TaskType[];
  removeTasks: (todolistID: string, id: string) => void;
  changeFilter: (todolistID: string, value: FilterValuesType) => void;
  title: string;
  addTask: (todolistID: string, title: string) => void;
  changeTaskStatus: (todolistID: string, taskId: string, taskStatus: TaskStatuses) => void;
  filter: string;
  removeTodolist: (todolistID: string) => void;

  updateTaskTitle: (todoListID: string, taskID: string, newTitle: string) => void;
  updateTodolistTitle: (todolistID: string, newTitle: string) => void;
  entityStatus: RequestStatusType;
};
export const TodoList = memo(
  ({
    todolistID,
    tasks,
    removeTasks,
    changeFilter,
    title,
    addTask,
    changeTaskStatus,
    filter,
    removeTodolist,
    updateTaskTitle,
    updateTodolistTitle,
    entityStatus,
  }: TodoListPropsType) => {
    const dispatch = useAppDispatch();

    const removeTodolistHandler = () => {
      removeTodolist(todolistID);
    };

    const addTaskHandler = useCallback(
      (title: string) => {
        addTask(todolistID, title);
      },
      [addTask, todolistID],
    );

    const updateTodolistTitleHandler = useCallback(
      (newTitle: string) => {
        updateTodolistTitle(todolistID, newTitle);
      },
      [todolistID, updateTodolistTitle],
    );

    const onActiveClickHandler = useCallback(() => {
      changeFilter(todolistID, "active");
    }, [todolistID, changeFilter]);
    const onAllClickHandler = useCallback(() => {
      changeFilter(todolistID, "all");
    }, [todolistID, changeFilter]);
    const onCompletedClickHandler = useCallback(() => {
      changeFilter(todolistID, "completed");
    }, [todolistID, changeFilter]);

    let filteredTasks = tasks;
    filteredTasks = useMemo(() => {
      if (filter === "completed") {
        filteredTasks = tasks.filter((task) => task.status === 2);
      }
      if (filter === "active") {
        filteredTasks = tasks.filter((task) => task.status === 0);
      }
      return filteredTasks;
    }, [tasks, filter]);

    return (
      <div>
        <h3>
          <EditableSpan
            oldTitle={title}
            updateTitle={updateTodolistTitleHandler}
            disabled={entityStatus === "loading"}
          />
          <IconButton aria-label="delete" onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
            <DeleteIcon />
          </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler} disabled={entityStatus === "loading"} />
        {!filteredTasks.length ? (
          <p>No tasks</p>
        ) : (
          <List>
            {filteredTasks.map((task) => {
              return (
                <Task
                  key={task.id}
                  todolistID={todolistID}
                  task={task}
                  removeTasks={removeTasks}
                  changeTaskStatus={changeTaskStatus}
                  updateTaskTitle={updateTaskTitle}
                  disabled={entityStatus === "loading"}
                />
              );
            })}
          </List>
        )}

        <Box sx={FilterButtonContainerSx}>
          <MyButton
            variant={filter === "all" ? "contained" : "text"}
            color="secondary"
            onClick={onAllClickHandler}
            title="All"
          />
          <MyButton
            variant={filter === "active" ? "contained" : "text"}
            color="error"
            onClick={onActiveClickHandler}
            title="Active"
          />
          <MyButton
            variant={filter === "completed" ? "contained" : "text"}
            color="primary"
            onClick={onCompletedClickHandler}
            title="Completed"
          />
        </Box>
      </div>
    );
  },
);

type MyButtonPropsType = {} & ButtonProps;

const MyButton = memo(({ variant, color, onClick, title }: MyButtonPropsType) => {
  return (
    <Button variant={variant} color={color} onClick={onClick}>
      {title}
    </Button>
  );
});
