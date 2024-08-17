export type Action<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">;

type FieldsError = {
  error: string;
  field: string;
};
export type BaseResponse<T = {}> = {
  data: T;
  fieldsErrors: FieldsError[];
  messages: string[];
  resultCode: number;
};

export type RejectAppError = {
  error: BaseResponse;
  type: "appError";
};

export type RejectCatchError = {
  error: unknown;
  type: "catchError";
};

export type RejectActionError = RejectAppError | RejectCatchError;
