import { createAppAsyncThunk, handleAppError, handleNetworkServerError } from "common/utils";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/appSlice";
import { todolistsActions } from "features/TodolistPage/Todolist/todolistsSlice";
import { authAPI, LoginParamsType } from "features/login/api/authApi";
import { ResultCode } from "common/enum";
import { thunkTryCatch } from "common/utils/thunTryCatch";

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
  (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    return thunkTryCatch(thunkApi, async () => {
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleAppError(dispatch, res.data, isShowAppError);
        return rejectWithValue(res.data);
      }
    });
  },
);

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(`${slice.name}/me`, async (_, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  return thunkTryCatch(thunkApi, async () => {
    const res = await authAPI.me();
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true };
    } else {
      handleAppError(dispatch, res.data, false);
      return rejectWithValue(null);
    }
  }).finally(() => dispatch(appActions.setIsInitialized({ isInitialized: true })));
});

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(`${slice.name}/logout`, (_, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  return thunkTryCatch(thunkApi, async () => {
    const res = await authAPI.logout();
    if (res.data.resultCode === ResultCode.success) {
      dispatch(todolistsActions.clearTodosData());
      return { isLoggedIn: false };
    } else {
      handleAppError(dispatch, res.data);
      return rejectWithValue(null);
    }
  });
});

export const authReducer = slice.reducer;
export const { selectIsLoggedIn } = slice.selectors;
