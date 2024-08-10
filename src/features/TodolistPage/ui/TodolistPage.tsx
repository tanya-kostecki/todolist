import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TodoList } from "features/TodolistPage/ui/Todolist/TodoList";
import { AppRootStateType, useAppDispatch } from "app/store";
import { useCallback, useEffect } from "react";
import {
  addTodolist,
  fetchTodolists,
  selectTodolists,
  TodolistDomainType,
} from "features/TodolistPage/model/todolistsSlice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/login/model/authSlice";
import { AddItemForm } from "common/components";

export const TodolistPage = () => {
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(selectTodolists);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchTodolists());
  }, []);

  const addTodolistHandler = useCallback(
    (title: string) => {
      dispatch(addTodolist(title));
    },
    [dispatch],
  );

  if (!isLoggedIn) return <Navigate to={"/login"} />;

  return (
    <>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper elevation={5} sx={{ p: "20px" }}>
                <TodoList todolist={tl} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
