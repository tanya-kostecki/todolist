import {
  deleteTodolist,
  fetchTodolists,
  TodolistDomainType,
  todolistsActions,
  todolistsReducer,
} from "features/TodolistPage/Todolist/todolistsSlice";
import { v1 } from "uuid";
import { Action } from "common/types";

let todolistId1: string;
let todolistId2: string;
let todolistId3: string;

let startState: TodolistDomainType[];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  todolistId3 = v1();

  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", addedDate: "26-02-23", order: 0, entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", filter: "all", addedDate: "26-02-23", order: 0, entityStatus: "idle" },
  ];
});

test("todolists should be added", () => {
  const action: Action<typeof fetchTodolists.fulfilled> = {
    type: fetchTodolists.fulfilled.type,
    payload: {
      todolists: startState,
    },
  };

  const endState = todolistsReducer([], action);

  expect(endState.length).toBe(2);
});

test("correct Todolist should be removed", () => {
  const action: Action<typeof deleteTodolist.fulfilled> = {
    type: deleteTodolist.fulfilled.type,
    payload: {
      todolistId: todolistId1,
    },
  };
  const endState = todolistsReducer(startState, action);

  //expected results
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct Todolist should be added", () => {
  const newTodo = {
    id: todolistId3,
    title: "New Todolist",
    filter: "all",
    addedDate: "26-02-23",
    order: 0,
    entityStatus: "idle",
  };
  const endState = todolistsReducer(startState, todolistsActions.addTodolist({ todolist: newTodo }));

  //expected results
  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe("New Todolist");
});

test("correct Todolist should change its name", () => {
  const endState = todolistsReducer(
    startState,
    todolistsActions.updateTodolistTitle({ id: todolistId2, title: "New Title" }),
  );

  //expected results
  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("New Title");
});

test("correct filter of Todolist should be changed", () => {
  const endState = todolistsReducer(
    startState,
    todolistsActions.changeFilter({
      id: todolistId2,
      filter: "completed",
    }),
  );

  //expected results
  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe("completed");
});
