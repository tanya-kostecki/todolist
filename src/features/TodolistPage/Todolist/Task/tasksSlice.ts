import { TaskStateType } from "app/App";
import {
  CreateTaskArgs,
  DeleteTaskArgs,
  TaskType,
  todolistApi,
  UpdateTaskArgs,
  UpdateTaskModelType,
} from "features/TodolistPage/Todolist/todolistApi";
import { RequestStatusType } from "app/appSlice";
import { handleAppError, createAppAsyncThunk, thunkTryCatch } from "common/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTodolist,
  deleteTodolist,
  fetchTodolists,
  todolistsActions,
} from "features/TodolistPage/Todolist/todolistsSlice";
import { ResultCode } from "common/enum";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {
    setTaskEntityStatus: (
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        entityStatus: RequestStatusType;
      }>,
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const todolist = state[action.payload.task.todoListId];
        todolist.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((todo) => {
          state[todo.id] = [];
        });
      })
      .addCase(todolistsActions.clearTodosData, (state, action) => {
        return {};
      });
  },
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
});

//thunk creators
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  (todolistId: string, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.getTasks(todolistId);
      return { todolistId, tasks: res.data.items };
    });
  },
);

export const addTask = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgs>(
  `${slice.name}/addTask`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.createTask(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { task: res.data.data.item };
      } else {
        handleAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    });
  },
);

export const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  `${slice.name}/updateTask`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const { todolistId, taskId, domainModel } = arg;
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(
        tasksActions.setTaskEntityStatus({
          todolistId: todolistId,
          taskId: taskId,
          entityStatus: "loading",
        }),
      );
      const tasks = getState().tasks;
      const task = tasks[todolistId].find((t: TaskType) => t.id === taskId);
      if (!task) {
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        startDate: task.startDate,
        status: task.status,
        ...domainModel,
      };

      await todolistApi.updateTask(todolistId, taskId, apiModel);
      dispatch(
        tasksActions.setTaskEntityStatus({
          todolistId: todolistId,
          taskId: taskId,
          entityStatus: "succeeded",
        }),
      );
      return arg;
    });
  },
);

export const deleteTask = createAppAsyncThunk<DeleteTaskArgs, DeleteTaskArgs>(
  `${slice.name}/deleteTask`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId, taskId } = arg;
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
      const res = await todolistApi.deleteTask(arg);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
        return arg;
      } else {
        handleAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    });
  },
);

export type UpdateDomainTaskModelType = Partial<UpdateTaskModelType>;

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const { selectTasks } = slice.selectors;
