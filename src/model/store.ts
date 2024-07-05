import { tasksReducer } from "model/tasksSlice";
import { todolistsReducer } from "model/todolistsSlice";
import { AnyAction, UnknownAction } from "redux";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { appReducer } from "model/appSlice";
import { authReducer } from "model/authSlice";
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
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
//@ts-ignore
window.store = store;
