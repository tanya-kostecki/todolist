import { Dispatch } from "redux";
import { setAppStatus, SetErrorType, SetInitializedActionType, setIsInitializedAC, SetStatusType } from "./app-reducer";
import { LoginType } from "pages/login/Login";
import { authAPI } from "api/api";
import { handleAppError, handleNetworkServerError } from "utils/ErrorUtils";
import { ClearDataActionType, clearTodosDataAC } from "./todolists-reducer";

const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.isLoggedIn };
    default:
      return state;
  }
};
// actions
export const setIsLoggedInAC = (isLoggedIn: boolean) => ({ type: "login/SET-IS-LOGGED-IN", isLoggedIn }) as const;

// thunks
export const loginTC = (data: LoginType) => (dispatch: Dispatch<AuthActionsType>) => {
  dispatch(setAppStatus("loading"));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatus("idle"));
    })
    .catch((err) => {
      handleNetworkServerError(dispatch, err);
    });
};

export const meTC = () => (dispatch: Dispatch<AuthActionsType>) => {
  dispatch(setAppStatus("loading"));
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatus("idle"));
    })
    .catch((err) => {
      handleNetworkServerError(dispatch, err);
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true));
    });
};

export const logoutTC = () => (dispatch: Dispatch<AuthActionsType>) => {
  dispatch(setAppStatus("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(clearTodosDataAC());
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatus("idle"));
    })
    .catch((err) => {
      handleNetworkServerError(dispatch, err);
    });
};

// types
type AuthActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetStatusType
  | SetErrorType
  | SetInitializedActionType
  | ClearDataActionType;
