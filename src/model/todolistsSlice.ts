import { FilterValuesType } from "App";
import { todolistApi, TodolistType } from "api/api";
import { appActions, RequestStatusType } from "model/appSlice";
import { handleNetworkServerError } from "utils/ErrorUtils";
import { AppThunk } from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "model/tasksSlice";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    updateTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].title = action.payload.title;
    },
    changeFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeEntityStatus: (state, action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    setTodolist: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: "all", entityStatus: "idle" }));
    },
    clearTodosData: (state, action: PayloadAction) => {
      return [];
    },
  },
});

//thunk creators
export const getTodosTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistApi
    .getTodolists()
    .then((res) => {
      dispatch(todolistsActions.setTodolist({ todolists: res.data }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return res.data;
    })
    .then((todos: TodolistType[]) => todos.forEach((todo) => dispatch(fetchTasks(todo.id))))
    .catch((err) => handleNetworkServerError(dispatch, err));
};

export const deleteTodosTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
    todolistApi
      .deleteTodolist(todolistId)
      .then((res) => {
        dispatch(todolistsActions.removeTodolist({ id: todolistId }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "succeeded" }));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

export const createTodosTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistApi
      .createTodolist(title)
      .then((res) => {
        dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

export const updateTodosTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
    todolistApi
      .updateTodolist(todolistId, title)
      .then((res) => {
        dispatch(todolistsActions.updateTodolistTitle({ id: todolistId, title }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "succeeded" }));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
