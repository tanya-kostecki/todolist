import { handleAppError, handleNetworkServerError } from "common/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/appSlice";
import { todolistsActions } from "features/TodolistPage/Todolist/todolistsSlice";
import { authAPI, LoginParamsType } from "features/login/api/authApi";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        } else {
          handleAppError(dispatch, res.data);
        }
        dispatch(appActions.setAppStatus({ status: "idle" }));
      })
      .catch((err) => {
        handleNetworkServerError(dispatch, err);
      });
  };

export const meTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      } else {
        // handleAppError(dispatch, res.data);
      }
      dispatch(appActions.setAppStatus({ status: "idle" }));
    })
    // .catch((err) => {
    //   handleNetworkServerError(dispatch, err);
    // })
    .finally(() => {
      dispatch(appActions.setIsInitialized({ isInitialized: true }));
    });
};

export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(todolistsActions.clearTodosData());
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(appActions.setAppStatus({ status: "idle" }));
    })
    .catch((err) => {
      handleNetworkServerError(dispatch, err);
    });
};

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const { selectIsLoggedIn } = slice.selectors;
