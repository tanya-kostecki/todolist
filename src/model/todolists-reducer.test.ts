import {
  addTodolistAC,
  changeFilterAC,
  removeTodolistAC,
  TodolistDomainType,
  todolistsReducer,
  updateTodolistTitleAC,
} from "./todolists-reducer";
import { v1 } from "uuid";

let todolistId1: string;
let todolistId2: string;

let startState: TodolistDomainType[];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  //start state
  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", addedDate: "26-02-23", order: 0, entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", filter: "all", addedDate: "26-02-23", order: 0, entityStatus: "idle" },
  ];
});

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

  //expected results
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  const endState = todolistsReducer(startState, addTodolistAC("New Todolist", todolistId1));

  //expected results
  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe("New Todolist");
});

test("correct todolist should change its name", () => {
  const endState = todolistsReducer(startState, updateTodolistTitleAC(todolistId2, "New Title"));

  //expected results
  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("New Title");
});

test("correct filter of todolist should be changed", () => {
  const endState = todolistsReducer(startState, changeFilterAC(todolistId2, "completed"));

  //expected results
  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe("completed");
});
