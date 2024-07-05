import { AppDispatch } from "app/store";
import { appActions } from "app/appSlice";
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
