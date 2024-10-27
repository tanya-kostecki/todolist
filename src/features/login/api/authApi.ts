import { instance } from "common/instance/instance";
import { BaseResponse } from "common/types";
import { LoginParamsType, UserType } from "features/login/api/authApi.types";

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
  getCaptcha() {
    return instance.get<{ url: string }>("/security/get-captcha-url");
  },
};
