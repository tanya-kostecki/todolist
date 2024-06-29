import { TaskPriorities, TaskStatuses, TaskType } from "../api/api";
import { addTaskAC, removeTaskAC, tasksReducer, updateTaskAC } from "./tasks-reducer";
import { addTodolistAC, removeTodolistAC } from "./todolists-reducer";
import { TaskStateType } from "../AppLesson";

let initialState: TaskStateType;
beforeEach(() => {
  initialState = {
    todolistID1: [
      {
        description: "",
        title: "HTML",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "JS",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "Redux",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
    ],
    todolistID2: [
      {
        description: "",
        title: "Milk",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "GraphQL",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "Milk",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
    ],
  };
});

test("correct task should be deleted", () => {
  const endState = tasksReducer(initialState, removeTaskAC("todolistID2", "2"));

  expect(endState).toStrictEqual({
    todolistID1: [
      {
        description: "",
        title: "HTML",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "ReactL",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "Redux",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
      },
    ],
    todolistID2: [
      {
        description: "",
        title: "Milk",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "Milk",
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "todolistID1",
        order: 0,
        addedDate: "",
      },
    ],
  });
});

test("correct task should be added to correct todolist", () => {
  const newTask: TaskType = {
    description: "",
    title: "Juice",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    id: "1",
    todoListId: "todolistID1",
    order: 0,
    addedDate: "",
    entityStatus: "idle",
  };
  const endState = tasksReducer(initialState, addTaskAC(newTask));

  expect(endState["todolistID1"].length).toBe(4);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID2"][0].id).toBeDefined();
  expect(endState["todolistID1"][0].title).toBe("Juice");
  expect(endState["todolistID2"][0].status).toBe(0);
});

test("status of specified task should be changed", () => {
  const endState = tasksReducer(
    initialState,
    updateTaskAC("todolistID2", "2", {
      title: "GraphQL",
      description: "",
      priority: 0,
      startDate: "",
      deadline: "",
      status: TaskStatuses.Completed,
    }),
  );

  expect(endState["todolistID2"][1].status).toBe(2);
  expect(endState["todolistID1"][1].status).toBe(0);
  expect(endState["todolistID2"][1].title).toBe("GraphQL");
});

test("title of specified task should be changed", () => {
  const endState = tasksReducer(
    initialState,
    updateTaskAC("todolistID2", "2", {
      title: "Bread",
      description: "",
      priority: 0,
      startDate: "",
      deadline: "",
      status: TaskStatuses.Completed,
    }),
  );

  expect(endState["todolistID2"][1].title).toBe("Bread");
  expect(endState["todolistID1"][1].title).toBe("JS");
});

test("new array should be added when new todolist is added", () => {
  const action = addTodolistAC("new todolist", "todolistID1");

  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistID1" && k !== "todolistID2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
  const action = removeTodolistAC("todolistID2");

  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID2"]).not.toBeDefined();
});
