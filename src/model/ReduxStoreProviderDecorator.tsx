import React from "react";
import { Provider } from "react-redux";
import { tasksReducer } from "model/tasksSlice";
import { todolistsReducer } from "model/todolistsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "model/appSlice";
import { authReducer } from "model/authSlice";

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
