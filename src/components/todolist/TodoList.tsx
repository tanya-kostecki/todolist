import React, { ChangeEvent, memo, useCallback, useMemo } from "react";
import { FilterValuesType, TaskType } from "../../App";
import { AddItemForm } from "../AddItemForm";
import { EditableSpan } from "../EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button, { ButtonProps } from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Box } from "@mui/material";
import { FilterButtonContainerSx, getListItemSx } from "./Todolist.styles";
import { Task } from "./Task";

type TodoListPropsType = {
  todolistID: string;
  tasks: TaskType[];
  removeTasks: (todolistID: string, id: string) => void;
  changeFilter: (todolistID: string, value: FilterValuesType) => void;
  title: string;
  addTask: (todolistID: string, title: string) => void;
  changeTaskStatus: (
    todolistID: string,
    taskId: string,
    taskStatus: boolean
  ) => void;
  filter: string;
  removeTodolist: (todolistID: string) => void;

  updateTaskTitle: (
    todoListID: string,
    taskID: string,
    newTitle: string
  ) => void;
  updateTodolistTitle: (todolistID: string, newTitle: string) => void;
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
  }: TodoListPropsType) => {
    // console.log("Todolist");
    // const changeFilterTaskHandler = (filter: FilterValuesType) => {
    //   changeFilter(todolistID, filter);
    // };

    const removeTodolistHandler = () => {
      removeTodolist(todolistID);
    };

    const addTaskHandler = useCallback(
      (title: string) => {
        addTask(todolistID, title);
      },
      [addTask, todolistID]
    );

    const updateTodolistTitleHandler = useCallback(
      (newTitle: string) => {
        updateTodolistTitle(todolistID, newTitle);
      },
      [todolistID, updateTodolistTitle]
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
      console.log('useMemo')
      if (filter === "completed") {
        filteredTasks = tasks.filter((task) => task.isDone === true);
      }
      if (filter === "active") {
        filteredTasks = tasks.filter((task) => task.isDone === false);
      }
      return filteredTasks
    }, [tasks, filter])

    return (
      <div>
        <h3>
          <EditableSpan
            oldTitle={title}
            updateTitle={updateTodolistTitleHandler}
          />
          <IconButton aria-label="delete" onClick={removeTodolistHandler}>
            <DeleteIcon />
          </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler} />
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
                />
              );
            })}
          </List>
        )}

        <Box sx={FilterButtonContainerSx}>
          <MyButton
            variant={filter === "all" ? "contained" : "text"}
            color="secondary"
            // onClick={() => changeFilterTaskHandler("all")}
            onClick={onAllClickHandler}
            title="All"
          />
          <MyButton
            variant={filter === "active" ? "contained" : "text"}
            color="error"
            // onClick={() => changeFilterTaskHandler("active")}
            onClick={onActiveClickHandler}
            title="Active"
          />
          <MyButton
            variant={filter === "completed" ? "contained" : "text"}
            color="primary"
            // onClick={() => changeFilterTaskHandler("completed")}
            onClick={onCompletedClickHandler}
            title="Completed"
          />
        </Box>
      </div>
    );
  }
);

type MyButtonPropsType = {} & ButtonProps;
//interface IMyButton extends ButtonProps {}

const MyButton = memo(
  ({ variant, color, onClick, title }: MyButtonPropsType) => {
    // console.log('Button')
    return (
      <Button variant={variant} color={color} onClick={onClick}>
        {title}
      </Button>
    );
  }
);
