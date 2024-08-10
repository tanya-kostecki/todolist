import { instance } from "common/instance/instance";
import { BaseResponse } from "common/types";
import { TodolistType } from "features/TodolistPage/api/todolistApi.types";

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
};
