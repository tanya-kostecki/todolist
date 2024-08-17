import { createAppAsyncThunk } from "common/utils";
import { createSlice, isFulfilled, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/model/appSlice";
import { todolistsActions } from "features/TodolistPage/model/todolistsSlice";
import { authAPI } from "features/login/api/authApi";
import { ResultCode } from "common/enum";
import { LoginParamsType } from "features/login/api/authApi.types";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isFulfilled(login, logout, me), (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
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
    const { rejectWithValue } = thunkApi;
    try {
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue({ error: res.data, type: "appError" });
      }
    } catch (error) {
      return rejectWithValue({ error, type: "catchError" });
    }
  },
);

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(`${slice.name}/me`, async (_, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue({ error: res.data, type: "appError" });
    }
  } catch (error) {
    return rejectWithValue({ error, type: "catchError" });
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/logout`,
  async (_, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(todolistsActions.clearTodosData());
        return { isLoggedIn: false };
      } else {
        return rejectWithValue({ error: res.data, type: "appError" });
      }
    } catch (error) {
      return rejectWithValue({ error, type: "catchError" });
    }
  },
);

export const authReducer = slice.reducer;
export const { selectIsLoggedIn } = slice.selectors;
export const {} = slice.actions;
