import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAppDispatch } from "app/model/store";
import { useSelector } from "react-redux";
import { appActions, selectError } from "app/model/appSlice";

export const CustomizedSnackbars = () => {
  const error = useSelector(selectError);
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
