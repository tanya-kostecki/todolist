export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  isInitialized: false,
  error: null as null | string,
  status: "idle" as RequestStatusType,
};

type InitialStateType = typeof initialState;

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS": {
      return { ...state, status: action.status };
    }
    case "APP/SET-ERROR": {
      return { ...state, error: action.error };
    }
    case "SET-INITIALIZED": {
      return { ...state, isInitialized: action.isInitialized };
    }
    default:
      return state;
  }
};

export type SetStatusType = ReturnType<typeof setAppStatus>;
export type SetErrorType = ReturnType<typeof setErrorAC>;
export type SetInitializedActionType = ReturnType<typeof setIsInitializedAC>;
type ActionsType = SetStatusType | SetErrorType | SetInitializedActionType;

export const setAppStatus = (status: RequestStatusType) => {
  return {
    type: "APP/SET-STATUS",
    status,
  } as const;
};

export const setErrorAC = (error: null | string) => {
  return {
    type: "APP/SET-ERROR",
    error,
  } as const;
};
export const setIsInitializedAC = (isInitialized: boolean) => {
  return {
    type: "SET-INITIALIZED",
    isInitialized,
  } as const;
};
