import { Dispatch } from "redux";
import { ResponseType } from "api/api";
import { appActions } from "model/appSlice";
import { AppDispatch } from "model/store";
import axios from "axios";

export const handleNetworkServerError = (dispatch: AppDispatch, err: unknown) => {
  let errorMessage = "Some error occurred";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }
  dispatch(appActions.setError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};

export const handleAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setError({ error: "Something went wrong" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
