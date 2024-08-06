import { appActions } from "app/appSlice";
import { handleNetworkServerError } from "common/utils/handleNetworkServerError";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootStateType } from "app/store";
import { BaseResponse } from "common/types";

type ThunkApi = BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponse>;
export const thunkTryCatch = async <T>(
  { dispatch, rejectWithValue }: ThunkApi,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof rejectWithValue>> => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    return await logic();
  } catch (error) {
    handleNetworkServerError(dispatch, error);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
  }
};
