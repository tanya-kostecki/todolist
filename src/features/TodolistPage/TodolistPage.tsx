import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TodoList } from "features/TodolistPage/Todolist/TodoList";
import { AppRootStateType, useAppDispatch } from "app/store";
import { useCallback, useEffect } from "react";
import {
  createTodosTC,
  deleteTodosTC,
  getTodosTC,
  todolistsActions,
  updateTodosTC,
} from "features/TodolistPage/Todolist/todolistsSlice";
import { FilterValuesType, TaskStateType, TodolistType } from "app/App";
import { addTask, deleteTaskTC, updateTask } from "features/TodolistPage/Todolist/Task/tasksSlice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/login/model/authSlice";
import { AddItemForm } from "common/components";
import { TaskStatuses } from "common/enum";

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

  const addTaskHandler = useCallback(
    (todolistId: string, title: string) => {
      dispatch(addTask({ todolistId, title }));
    },
    [dispatch],
  );

  const changeTaskStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(updateTask({ taskId, todolistId, domainModel: { status } }));
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
    (todolistId: string, taskId: string, title: string) => {
      dispatch(updateTask({ todolistId, taskId, domainModel: { title } }));
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
                  addTask={addTaskHandler}
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
