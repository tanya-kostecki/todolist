import { Dispatch } from "redux";
import { appActions } from "app/appSlice";
import { BaseResponse } from "common/types";

export const handleAppError = <T>(dispatch: Dispatch, data: BaseResponse<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setError({ error: "Something went wrong" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
