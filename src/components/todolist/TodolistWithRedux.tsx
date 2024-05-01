import React, { ChangeEvent } from "react";
import { FilterValuesType, TaskType } from "../../App";
import { AddItemForm } from "../AddItemForm";
import { EditableSpan } from "../EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Box } from "@mui/material";
import { FilterButtonContainerSx, getListItemSx } from "./Todolist.styles";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "../../model/store";
// import { TaskStateType } from "../../AppWithReducers";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../../model/tasks-reducer";
import {
  changeFilterAC,
  removeTodolistAC,
  updateTodolistTitleAC,
} from "../../model/todolists-reducer";

type TodoListPropsType = {
  todolistID: string;
  title: string;
  filter: FilterValuesType;
};
export function TodoListWithRedux(props: TodoListPropsType) {
  const tasks = useSelector<AppRootStateType, TaskType[]>(
    (state) => state.tasks[props.todolistID]
  );

  let filteredTasks = tasks;
  if (props.filter === "completed") {
    filteredTasks = tasks.filter((task) => task.isDone === true);
  }

  if (props.filter === "active") {
    filteredTasks = tasks.filter((task) => task.isDone === false);
  }

  const dispatch = useDispatch();
  const changeFilterTaskHandler = (filter: FilterValuesType) => {
    dispatch(changeFilterAC(props.todolistID, filter));
  };

  const removeTodolistHandler = () => {
    dispatch(removeTodolistAC(props.todolistID));
  };

  const addTaskHandler = (title: string) => {
    dispatch(addTaskAC(props.todolistID, title));
  };

  const updateTaskTitleHandler = (taskID: string, newTitle: string) => {
    dispatch(changeTaskTitleAC(props.todolistID, taskID, newTitle));
  };

  const updateTodolistTitleHandler = (newTitle: string) => {
    dispatch(updateTodolistTitleAC(props.todolistID, newTitle));
  };

  return (
    <div>
      <h3>
        <EditableSpan
          oldTitle={props.title}
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
            const removeTaskHandler = () => {
              dispatch(removeTaskAC(props.todolistID, task.id));
            };

            const changeTaskStatusHandler = (
              event: ChangeEvent<HTMLInputElement>
            ) => {
              const newTaskStatus = event.currentTarget.checked;
              dispatch(
                changeTaskStatusAC(props.todolistID, task.id, newTaskStatus)
              );
            };

            return (
              <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
                <div>
                  <Checkbox
                    checked={task.isDone}
                    onChange={changeTaskStatusHandler}
                  />
                  <EditableSpan
                    oldTitle={task.title}
                    updateTitle={(newTitle: string) =>
                      updateTaskTitleHandler(task.id, newTitle)
                    }
                  />
                </div>
                <IconButton aria-label="delete" onClick={removeTaskHandler}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      )}

      <Box sx={FilterButtonContainerSx}>
        <Button
          variant={props.filter === "all" ? "contained" : "text"}
          color="secondary"
          onClick={() => changeFilterTaskHandler("all")}
        >
          All
        </Button>
        <Button
          variant={props.filter === "active" ? "contained" : "text"}
          color="error"
          onClick={() => changeFilterTaskHandler("active")}
        >
          Active
        </Button>
        <Button
          variant={props.filter === "completed" ? "contained" : "text"}
          color="primary"
          onClick={() => changeFilterTaskHandler("completed")}
        >
          Completed
        </Button>
      </Box>
    </div>
  );
}
