import { FilterValuesType } from "app/ui/App";
import { todolistApi } from "features/TodolistPage/api/todolistApi";
import { RequestStatusType } from "app/model/appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "features/TodolistPage/model/tasksSlice";
import { createAppAsyncThunk } from "common/utils";
import { ResultCode } from "common/enum";
import { ChangeTodolistTitleArgs, TodolistType } from "features/TodolistPage/api/todolistApi.types";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeEntityStatus: (state, action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    clearTodosData: () => {
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
  selectors: {
    selectTodolists: (state) => state,
  },
});

//thunk creators
export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${slice.name}/fetchTodolists`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistApi.getTodolists();
      res.data.forEach((todo) => dispatch(fetchTasks(todo.id)));
      return { todolists: res.data };
    } catch (error) {
      return rejectWithValue({ error, type: "catchError" });
    }
  },
);

export const deleteTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/deleteTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(todolistsActions.changeEntityStatus({ todolistId: arg.todolistId, entityStatus: "loading" }));
      const res = await todolistApi.deleteTodolist(arg.todolistId);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(todolistsActions.changeEntityStatus({ todolistId: arg.todolistId, entityStatus: "succeeded" }));
        return { todolistId: arg.todolistId };
      } else {
        return rejectWithValue({ error: res.data, type: "appError" });
      }
    } catch (error) {
      return rejectWithValue({ error, type: "catchError" });
    }
  },
);

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await todolistApi.createTodolist(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { todolist: res.data.data.item };
      } else {
        return rejectWithValue({ error: res.data, type: "appError" });
      }
    } catch (error) {
      return rejectWithValue({ error, type: "catchError" });
    }
  },
);

export const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleArgs, ChangeTodolistTitleArgs>(
  `${slice.name}/changeTodolistTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId, title } = arg;
    try {
      dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
      const res = await todolistApi.updateTodolist(todolistId, title);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "succeeded" }));
        return { todolistId, title };
      } else {
        dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "failed" }));
        return rejectWithValue({ error: res.data, type: "appError" });
      }
    } catch (error) {
      return rejectWithValue({ error, type: "catchError" });
    }
  },
);

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const { selectTodolists } = slice.selectors;
