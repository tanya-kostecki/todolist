import { FilterValuesType } from "app/App";
import { todolistApi } from "features/TodolistPage/api/todolistApi";
import { RequestStatusType } from "app/appSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "features/TodolistPage/model/tasksSlice";
import { createAppAsyncThunk, handleAppError, thunkTryCatch } from "common/utils";
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
export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  `${slice.name}/fetchTodolists`,
  (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.getTodolists();
      res.data.forEach((todo) => dispatch(fetchTasks(todo.id)));
      return { todolists: res.data };
    });
  },
);

export const deleteTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/deleteTodolist`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistsActions.changeEntityStatus({ todolistId: arg.todolistId, entityStatus: "loading" }));
      const res = await todolistApi.deleteTodolist(arg.todolistId);
      dispatch(todolistsActions.changeEntityStatus({ todolistId: arg.todolistId, entityStatus: "succeeded" }));
      return { todolistId: arg.todolistId };
    });
  },
);

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolist`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.createTodolist(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { todolist: res.data.data.item };
      } else {
        handleAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    });
  },
);

export const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleArgs, ChangeTodolistTitleArgs>(
  `${slice.name}/changeTodolistTitle`,
  (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { todolistId, title } = arg;
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
      const res = await todolistApi.updateTodolist(todolistId, title);
      dispatch(todolistsActions.changeEntityStatus({ todolistId, entityStatus: "succeeded" }));
      return { todolistId, title };
    });
  },
);

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const { selectTodolists } = slice.selectors;
