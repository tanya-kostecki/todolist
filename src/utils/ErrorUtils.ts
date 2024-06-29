import { Dispatch } from "redux";
import { ResponseType } from "api/api";
import { appActions } from "model/appSlice";

export const handleNetworkServerError = (dispatch: Dispatch, err: { message: string }) => {
  dispatch(appActions.setError({ error: err.message }));
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
