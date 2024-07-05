export type Action<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">;

export type ResponseType<T = {}> = {
  data: T;
  fieldErrors: string[];
  messages: string[];
  resultCode: number;
};
