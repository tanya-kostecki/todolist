import { tasksReducer } from "features/TodolistPage/Todolist/Task/tasksSlice";
import { todolistsReducer } from "features/TodolistPage/Todolist/todolistsSlice";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { appReducer } from "app/appSlice";
import { authReducer } from "features/login/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

//@ts-ignore
window.store = store;
