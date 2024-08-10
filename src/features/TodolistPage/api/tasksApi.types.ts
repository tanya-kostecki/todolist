import { UpdateDomainTaskModelType } from "features/TodolistPage/model/tasksSlice";
import { TaskPriorities, TaskStatuses } from "common/enum";
import { RequestStatusType } from "app/appSlice";

export type CreateTaskArgs = {
  todolistId: string;
  title: string;
};

export type DeleteTaskArgs = {
  todolistId: string;
  taskId: string;
};

export type UpdateTaskArgs = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
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

export type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
