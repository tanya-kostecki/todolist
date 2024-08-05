import { createAppAsyncThunk, handleAppError, handleNetworkServerError } from "common/utils";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/appSlice";
import { todolistsActions } from "features/TodolistPage/Todolist/todolistsSlice";
import { authAPI, LoginParamsType } from "features/login/api/authApi";
import { ResultCode } from "common/enum";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
  },
});

//thunks
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleAppError(dispatch, res.data, false);
        return rejectWithValue(res.data);
      }
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(`${slice.name}/me`, async (_, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.me();
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true };
    } else {
      handleAppError(dispatch, res.data, false);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleNetworkServerError(dispatch, error);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/logout`,
  async (_, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(todolistsActions.clearTodosData());
        dispatch(appActions.setAppStatus({ status: "idle" }));
        return { isLoggedIn: false };
      } else {
        handleAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const authReducer = slice.reducer;
export const { selectIsLoggedIn } = slice.selectors;
