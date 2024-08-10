import { instance } from "common/instance/instance";
import { BaseResponse } from "common/types";
import {
  CreateTaskArgs,
  DeleteTaskArgs,
  GetTasksResponse,
  TaskType,
  UpdateTaskModelType,
} from "features/TodolistPage/api/tasksApi.types";

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(arg: DeleteTaskArgs) {
    const { todolistId, taskId } = arg;
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(arg: CreateTaskArgs) {
    const { todolistId, title } = arg;
    return instance.post<BaseResponse<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponse<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};
