import { RequestStatusType } from "app/appSlice";
import { UpdateDomainTaskModelType } from "features/TodolistPage/Todolist/Task/tasksSlice";
import { instance } from "common/instance/instance";
import { BaseResponse } from "common/types";
import { TaskPriorities, TaskStatuses } from "common/enum";

export const todolistApi = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: TodolistType }>>("todo-lists", { title });
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<BaseResponse, { title: string }>(`todo-lists/${id}`, { title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
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

// types
export type CreateTaskArgs = {
  todolistId: string;
  title: string;
};

export type UpdateTaskArgs = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
};

export type UserType = {
  id: number;
  email: string;
  password: string;
};

export type TodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
  entityStatus: RequestStatusType;
};

export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
