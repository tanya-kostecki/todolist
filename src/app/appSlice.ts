import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { RejectActionError } from "common/types";
import axios from "axios";
import { me } from "features/login/model/authSlice";
import { addTask } from "features/TodolistPage/model/tasksSlice";
import { addTodolist } from "features/TodolistPage/model/todolistsSlice";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState: {
    isInitialized: false,
    error: null as null | string,
    status: "idle" as RequestStatusType,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error;
    },
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(isRejected, (state) => {
        state.status = "failed";
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded";
      })
      .addMatcher(
        (action): action is PayloadAction<RejectActionError> => {
          return isRejected(action) && action.payload;
        },
        (state, action: PayloadAction<RejectActionError>) => {
          // if (
          //   action.type === addTodolist.rejected.type ||
          //   action.type === addTask.rejected.type ||
          //   action.type === me.rejected.type
          // )
          //   return;

          if (
            (action.type === addTodolist.rejected.type && action.payload.type === "appError") ||
            (action.type === addTask.rejected.type && action.payload.type === "appError") ||
            action.type === me.rejected.type
          )
            return;

          const defaultMessage = "Some error occurred";
          switch (action.payload.type) {
            case "appError": {
              const error = action.payload.error;
              state.error = error.messages.length ? error.messages[0] : defaultMessage;
              break;
            }
            case "catchError": {
              const error = action.payload.error;
              if (axios.isAxiosError(error)) {
                state.error = error.response?.data?.message || error.message || defaultMessage;
              } else if (error instanceof Error) {
                state.error = `Native error: ${error.message}`;
              } else {
                state.error = JSON.stringify(error);
              }
              break;
            }
            default:
              state.error = defaultMessage;
          }
        },
      );
  },
  selectors: {
    selectStatus: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
    selectIsInitialized: (sliceState) => sliceState.isInitialized,
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const { selectStatus, selectError, selectIsInitialized } = slice.selectors;
