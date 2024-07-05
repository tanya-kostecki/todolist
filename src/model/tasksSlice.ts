import { TaskStateType } from "App";
import {
  CreateTaskArgs,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistApi,
  UpdateTaskArgs,
  UpdateTaskModelType,
} from "api/api";
import { AppThunk } from "./store";
import { appActions, RequestStatusType } from "model/appSlice";
import { handleAppError, handleNetworkServerError } from "utils/ErrorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "model/todolistsSlice";
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
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
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolist, (state, action) => {
        action.payload.todolists.forEach((todo) => {
          state[todo.id] = [];
        });
      })
      .addCase(todolistsActions.clearTodosData, (state, action) => {
        return {};
      });
  },
});

//thunk creators
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistApi.getTasks(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolistId, tasks: res.data.items };
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const addTask = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgs>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistApi.createTask(arg);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleAppError(dispatch, res.data);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const { todolistId, taskId, domainModel } = arg;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
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
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(
        tasksActions.setTaskEntityStatus({
          todolistId: todolistId,
          taskId: taskId,
          entityStatus: "succeeded",
        }),
      );
      return arg;
    } catch (error) {
      handleNetworkServerError(dispatch, error);
      return rejectWithValue(null);
    }
  },
);

export const deleteTaskTC =
  (todolistId: string, taskId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
    todolistApi
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.removeTask({ todolistId, taskId }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
          dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
        } else {
          handleAppError(dispatch, res.data);
        }
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
