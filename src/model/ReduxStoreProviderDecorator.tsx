import React from "react";
import { Provider } from "react-redux";
import { AppRootStateType, store } from "./store";
import { combineReducers, legacy_createStore as createStore } from "redux";
import { tasksReducer } from "model/tasksSlice";
import { todolistsReducer } from "model/todolistsSlice";
import { v1 } from "uuid";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

const initialGlobalState = {
  todolists: [
    { id: "todolistId1", title: "What to learn", filter: "all" },
    { id: "todolistId2", title: "What to buy", filter: "all" },
  ],
  tasks: {
    ["todolistId1"]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: false },
    ],
    ["todolistId2"]: [
      { id: v1(), title: "Milk", isDone: false },
      { id: v1(), title: "React Book", isDone: true },
    ],
  },
};
// @ts-ignore
export const storybookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storybookStore}>{storyFn()}</Provider>;
};
