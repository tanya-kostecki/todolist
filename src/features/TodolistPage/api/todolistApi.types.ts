export type ChangeTodolistTitleArgs = {
  todolistId: string;
  title: string;
};

export type TodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
