import { FilterValuesType } from "app/App";
import { ChangeTodolistTitleArgs, todolistApi, TodolistType } from "features/TodolistPage/Todolist/todolistApi";
import { appActions, RequestStatusType } from "app/appSlice";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "features/TodolistPage/Todolist/Task/tasksSlice";
import { createAppAsyncThunk, handleNetworkServerError } from "common/utils";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    // updateTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
    //   const index = state.findIndex((todo) => todo.id === action.payload.id);
    //   if (index !== -1) state[index].title = action.payload.title;
    // },
    changeFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeEntityStatus: (state, action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    clearTodosData: (state, action: PayloadAction) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
        if (index !== -1) state[index].title = action.payload.title;
      });
  },
});

//thunk creators
export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  `${slice.name}/fetchTodolists`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistApi.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      res.data.forEach((todo) => dispatch(fetchTasks(todo.id)));
      return { todolists: res.data };
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const deleteTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/deleteTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeEntityStatus({ todolistId: arg.todolistId, entityStatus: "loading" }));
      const res = await todolistApi.deleteTodolist(arg.todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todolistsActions.changeEntityStatus({ todolistId: arg.todolistId, entityStatus: "succeeded" }));
      return { todolistId: arg.todolistId };
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistApi.createTodolist(arg);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleArgs, ChangeTodolistTitleArgs>(
  `${slice.name}/changeTodolistTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId, title } = arg;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
      const res = await todolistApi.updateTodolist(todolistId, title);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "succeeded" }));
      return { todolistId, title };
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

// export const updateTodosTC =
//   (todolistId: string, title: string): AppThunk =>
//   (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
//     todolistApi
//       .updateTodolist(todolistId, title)
//       .then((res) => {
//         dispatch(todolistsActions.updateTodolistTitle({ id: todolistId, title }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//         dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "succeeded" }));
//       })
//       .catch((err) => handleNetworkServerError(dispatch, err));
//   };

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
