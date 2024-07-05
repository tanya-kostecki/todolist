import { TaskStateType } from "app/App";
import { TodolistDomainType, todolistsActions } from "features/TodolistPage/Todolist/todolistsSlice";
import { tasksReducer } from "features/TodolistPage/Todolist/Task/tasksSlice";
import { todolistsReducer } from "features/TodolistPage/Todolist/todolistsSlice";
import { TodolistType } from "features/TodolistPage/Todolist/todolistApi";

test("ids should be equal", () => {
  const startTasksState: TaskStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];
  let todolist: TodolistType = {
    title: "new Todolist",
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
