export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

export type UserType = {
  id: number;
  email: string;
  password: string;
};
