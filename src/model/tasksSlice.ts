import { TaskStateType } from "App";
import { TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType } from "api/api";
import { AppRootStateType, AppThunk } from "./store";
import { appActions, RequestStatusType } from "model/appSlice";
import { handleAppError, handleNetworkServerError } from "utils/ErrorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "model/todolistsSlice";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const todolist = state[action.payload.task.todoListId];
      todolist.unshift(action.payload.task);
    },
    updateTask: (state, action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateTaskModelType }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
    },
    setTasks: (state, action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
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
export const getTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistApi
      .getTasks(todolistId)
      .then((res) => {
        dispatch(tasksActions.setTasks({ todolistId, tasks: res.data.items }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

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

export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistApi
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.addTask({ task: res.data.data.item }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleAppError(dispatch, res.data);
        }
      })
      .catch((err) => handleNetworkServerError(dispatch, err));
  };

type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }));
    const tasks = getState().tasks;
    const task = tasks[todolistId].find((t: TaskType) => t.id === taskId);
    if (task) {
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        startDate: task.startDate,
        status: task.status,
        ...domainModel,
      };

      todolistApi
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          dispatch(tasksActions.updateTask({ todolistId, taskId, model: apiModel }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
          dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "succeeded" }));
        })
        .catch((err) => handleNetworkServerError(dispatch, err));
    }
  };

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
