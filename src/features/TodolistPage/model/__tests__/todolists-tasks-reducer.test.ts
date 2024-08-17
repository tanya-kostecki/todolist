import { TaskStateType } from "app/ui/App";
import { addTodolist, TodolistDomainType } from "features/TodolistPage/model/todolistsSlice";
import { tasksReducer } from "features/TodolistPage/model/tasksSlice";
import { todolistsReducer } from "features/TodolistPage/model/todolistsSlice";
import { Action } from "common/types";

test("ids should be equal", () => {
  const startTasksState: TaskStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const action: Action<typeof addTodolist.fulfilled> = {
    type: addTodolist.fulfilled.type,
    payload: {
      todolist: {
        title: "new Todolist",
        id: "any id",
        addedDate: "",
        order: 0,
      },
    },
  };

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
