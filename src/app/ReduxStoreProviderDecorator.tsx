import React from "react";
import { Provider } from "react-redux";
import { tasksReducer } from "features/TodolistPage/model/tasksSlice";
import { todolistsReducer } from "features/TodolistPage/model/todolistsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "app/model/appSlice";
import { authReducer } from "features/login/model/authSlice";

export const storybookStore = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storybookStore}>{storyFn()}</Provider>;
};
