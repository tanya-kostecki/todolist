import { UserType } from "features/TodolistPage/Todolist/todolistApi";
import { instance } from "common/instance/instance";
import { BaseResponse } from "common/types";

export const authAPI = {
  me() {
    return instance.get<BaseResponse<UserType>>("auth/me");
  },
  login(data: LoginParamsType) {
    return instance.post<BaseResponse<{ userId: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<BaseResponse<{ userId: number }>>("auth/login");
  },
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
