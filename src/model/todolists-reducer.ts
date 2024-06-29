import { v1 } from "uuid";
import { FilterValuesType } from "AppLesson";
import { todolistApi, TodolistType } from "api/api";
import { AnyAction, Dispatch } from "redux";
import { appActions, RequestStatusType } from "model/appSlice";
import { handleNetworkServerError } from "utils/ErrorUtils";
import { getTasksTC } from "./tasks-reducer";
import { ThunkDispatch } from "redux-thunk";
import { AppRootStateType, AppThunk } from "./store";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof updateTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof changeFilterAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistAC>;
export type SetTodolistEntityStatusActionType = ReturnType<typeof setTodolistEntityStatusAC>;
export type ClearDataActionType = ReturnType<typeof clearTodosDataAC>;

export type TodolistActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolistsActionType
  | SetTodolistEntityStatusActionType
  | ClearDataActionType;

export let todolistID1 = v1();
export let todolistID2 = v1();

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: TodolistActionsType,
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.id);
    }
    case "ADD-TODOLIST": {
      return [
        {
          id: action.payload.todolistId,
          title: action.payload.title,
          filter: "all",
          addedDate: "",
          order: 0,
          entityStatus: "idle",
        },
        ...state,
      ];
    }

    case "CHANGE-TODOLIST-TITLE": {
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo));
    }
    case "CHANGE-TODOLIST-FILTER": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl));
    }
    case "SET-TODOLISTS": {
      return action.payload.todolists.map((todo) => ({ ...todo, filter: "all", entityStatus: "idle" }));
    }
    case "SET-TODOLIST-ENTITY-STATUS": {
      return state.map((tl) =>
        tl.id === action.payload.todolistId
          ? {
              ...tl,
              entityStatus: action.payload.entityStatus,
            }
          : tl,
      );
    }
    case "CLEAR-DATA": {
      return [];
    }
    default:
      return state;
  }
};

//AC = action creators
export const removeTodolistAC = (id: string) => ({ type: "REMOVE-TODOLIST", payload: { id } }) as const;
export const addTodolistAC = (title: string, todolistId: string) =>
  ({
    type: "ADD-TODOLIST",
    payload: { title, todolistId },
  }) as const;
export const updateTodolistTitleAC = (id: string, title: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: { id, title },
  }) as const;
export const changeFilterAC = (id: string, filter: FilterValuesType) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    payload: { id, filter },
  }) as const;
export const setTodolistAC = (todolists: TodolistType[]) =>
  ({ type: "SET-TODOLISTS", payload: { todolists } }) as const;
export const setTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
  ({
    type: "SET-TODOLIST-ENTITY-STATUS",
    payload: { todolistId, entityStatus },
  }) as const;
export const clearTodosDataAC = () => ({ type: "CLEAR-DATA" }) as const;

//thunk creators
export const getTodosTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistApi
    .getTodolists()
    .then((res) => {
      dispatch(setTodolistAC(res.data));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return res.data;
    })
    .then((todos: TodolistType[]) => todos.forEach((todo) => dispatch(getTasksTC(todo.id))))
    .catch((err) => handleNetworkServerError(dispatch, err));
};

export const deleteTodosTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(setTodolistEntityStatusAC(todolistId, "loading"));
    todolistApi
      .deleteTodolist(todolistId)
      .then((res) => {
        dispatch(removeTodolistAC(todolistId));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(setTodolistEntityStatusAC(todolistId, "succeeded"));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

export const createTodosTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistApi
      .createTodolist(title)
      .then((res) => {
        dispatch(addTodolistAC(res.data.data.item.title, res.data.data.item.id));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

export const updateTodosTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(setTodolistEntityStatusAC(todolistId, "loading"));
    todolistApi
      .updateTodolist(todolistId, title)
      .then((res) => {
        dispatch(updateTodolistTitleAC(todolistId, title));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(setTodolistEntityStatusAC(todolistId, "succeeded"));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };
