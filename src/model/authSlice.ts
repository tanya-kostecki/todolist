import { LoginType } from "pages/login/Login";
import { authAPI } from "api/api";
import { handleAppError, handleNetworkServerError } from "utils/ErrorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "model/store";
import { appActions } from "model/appSlice";
import { todolistsActions } from "model/todolistsSlice";

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
});

// thunks
export const loginTC =
  (data: LoginType): AppThunk =>
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
