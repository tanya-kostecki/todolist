import { Dispatch } from "redux";
import { appActions } from "app/appSlice";
import { BaseResponse } from "common/types";

export const handleAppError = <T>(dispatch: Dispatch, data: BaseResponse<T>, isSHowGlobal: boolean = true) => {
  if (isSHowGlobal) {
    dispatch(appActions.setError({ error: data.messages.length ? data.messages[0] : "Something went wrong" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
