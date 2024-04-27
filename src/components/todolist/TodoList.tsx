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
export function TodoList(props: TodoListPropsType) {

  const changeFilterTaskHandler = (filter: FilterValuesType) => {
    props.changeFilter(props.todolistID, filter);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.todolistID);
  };

  const addTaskHandler = (title: string) => {
    props.addTask(props.todolistID, title);
  };

  const updateTaskTitleHandler = (taskID: string, newTitle: string) => {
    props.updateTaskTitle(props.todolistID, taskID, newTitle);
  };

  const updateTodolistTitleHandler = (newTitle: string) => {
    props.updateTodolistTitle(props.todolistID, newTitle);
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

      {!props.tasks.length ? (
        <p>No tasks</p>
      ) : (
        <List>
          {props.tasks.map((task) => {
            const removeTaskHandler = () => {
              props.removeTasks(props.todolistID, task.id);
            };

            const changeTaskStatusHandler = (
              event: ChangeEvent<HTMLInputElement>
            ) => {
              const newTaskStatus = event.currentTarget.checked;
              props.changeTaskStatus(props.todolistID, task.id, newTaskStatus);
            };

            return (
              <ListItem
                key={task.id}
                sx={getListItemSx(task.isDone)}
              >
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
