import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AppRootStateType, useAppDispatch } from "model/store";
import { useSelector } from "react-redux";
import { appActions } from "model/appSlice";

export const CustomizedSnackbars = () => {
  const error = useSelector<AppRootStateType, null | string>((state) => state.app.error);
  const dispatch = useAppDispatch();
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(appActions.setError({ error: null }));
  };

  return (
    <div>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};
