import * as React from "react";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "components/AddItemForm";
import Paper from "@mui/material/Paper";
import { TodoList } from "components/todolist/TodoList";
import { AppRootStateType, useAppDispatch } from "model/store";
import { useCallback, useEffect } from "react";
import { createTodosTC, deleteTodosTC, getTodosTC, todolistsActions, updateTodosTC } from "model/todolistsSlice";
import { FilterValuesType, TaskStateType, TodolistType } from "App";
import { addTaskTC, deleteTaskTC, updateTaskTC } from "model/tasksSlice";
import { TaskStatuses } from "api/api";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "model/authSlice";

export const TodolistPage = () => {
  const todolists = useSelector<AppRootStateType, TodolistType[]>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TaskStateType>((state) => state.tasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(getTodosTC());
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(createTodosTC(title));
    },
    [dispatch],
  );

  const removeTasks = useCallback(
    (todolistID: string, taskID: string) => {
      dispatch(deleteTaskTC(todolistID, taskID));
    },
    [dispatch],
  );

  const changeFilter = useCallback(
    (todolistID: string, filter: FilterValuesType) => {
      dispatch(todolistsActions.changeFilter({ id: todolistID, filter }));
    },
    [dispatch],
  );

  const addTask = useCallback(
    (todolistID: string, title: string) => {
      dispatch(addTaskTC(todolistID, title));
    },
    [dispatch],
  );

  const changeTaskStatus = useCallback(
    (todolistID: string, taskID: string, status: TaskStatuses) => {
      dispatch(updateTaskTC(todolistID, taskID, { status: status }));
    },
    [dispatch],
  );

  const removeTodolist = useCallback(
    (todolistID: string) => {
      dispatch(deleteTodosTC(todolistID));
    },
    [dispatch],
  );

  const updateTaskTitle = useCallback(
    (todolistID: string, taskID: string, newTitle: string) => {
      dispatch(updateTaskTC(todolistID, taskID, { title: newTitle }));
    },
    [dispatch],
  );

  const updateTodolistTitle = useCallback(
    (todolistID: string, newTitle: string) => {
      dispatch(updateTodosTC(todolistID, newTitle));
    },
    [dispatch],
  );

  if (!isLoggedIn) return <Navigate to={"/login"} />;

  return (
    <>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={4}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper elevation={5} sx={{ p: "20px" }}>
                <TodoList
                  key={tl.id}
                  todolistID={tl.id}
                  tasks={tasks[tl.id]}
                  title={tl.title}
                  removeTasks={removeTasks}
                  changeFilter={changeFilter}
                  filter={tl.filter}
                  addTask={addTask}
                  changeTaskStatus={changeTaskStatus}
                  removeTodolist={removeTodolist}
                  updateTaskTitle={updateTaskTitle}
                  updateTodolistTitle={updateTodolistTitle}
                  entityStatus={tl.entityStatus}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
