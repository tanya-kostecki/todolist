export type Action<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">;

type FieldsError = {
  error: string;
  field: string;
};
export type ResponseType<T = {}> = {
  data: T;
  fieldsErrors: FieldsError[];
  messages: string[];
  resultCode: number;
};
