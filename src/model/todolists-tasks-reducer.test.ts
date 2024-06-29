import { TaskStateType } from "App";
import { TodolistDomainType, todolistsActions } from "model/todolistsSlice";
import { tasksReducer } from "model/tasksSlice";
import { todolistsReducer } from "model/todolistsSlice";
import { TodolistType } from "api/api";

test("ids should be equal", () => {
  const startTasksState: TaskStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];
  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = todolistsActions.addTodolist({ todolist });

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
