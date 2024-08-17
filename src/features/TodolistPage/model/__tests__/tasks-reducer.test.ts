import { addTask, deleteTask, fetchTasks, tasksReducer, updateTask } from "features/TodolistPage/model/tasksSlice";
import { TaskStateType } from "app/ui/App";
import { addTodolist, deleteTodolist } from "features/TodolistPage/model/todolistsSlice";
import { Action } from "common/types";
import { TaskPriorities, TaskStatuses } from "common/enum";
import { UpdateTaskModelType } from "features/TodolistPage/api/tasksApi.types";

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
  const action: Action<typeof deleteTask.fulfilled> = {
    type: deleteTask.fulfilled.type,
    payload: {
      taskId: "2",
      todolistId: "todolistID2",
    },
  };
  const endState = tasksReducer(initialState, action);

  expect(endState["todolistID1"].length).toBe(3);
  expect(endState["todolistID2"].length).toBe(2);
  expect(endState["todolistID2"].every((t) => t.id != "2")).toBeTruthy();
});

test("correct task should be added to correct Todolist", () => {
  const action: Action<typeof addTask.fulfilled> = {
    type: addTask.fulfilled.type,
    payload: {
      task: {
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
      },
    },
  };
  const endState = tasksReducer(initialState, action);

  expect(endState["todolistID1"].length).toBe(4);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID2"][0].id).toBeDefined();
  expect(endState["todolistID1"][0].title).toBe("Juice");
  expect(endState["todolistID2"][0].status).toBe(0);
});

test("title of specified task should be changed", () => {
  const action: Action<typeof updateTask.fulfilled> = {
    type: updateTask.fulfilled.type,
    payload: {
      taskId: "2",
      todolistId: "todolistID2",
      domainModel: {
        title: "yogurt",
      } as UpdateTaskModelType,
    },
  };

  const endState = tasksReducer(initialState, action);

  expect(endState["todolistID1"][1].title).toBe("JS");
  expect(endState["todolistID2"][1].title).toBe("yogurt");
  expect(endState["todolistID2"][0].title).toBe("Milk");
});

test("new array should be added when new Todolist is added", () => {
  const action: Action<typeof addTodolist.fulfilled> = {
    type: addTodolist.fulfilled.type,
    payload: {
      todolist: {
        id: "blabla",
        title: "new Todolist",
        order: 0,
        addedDate: "",
      },
    },
  };

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
  const action: Action<typeof deleteTodolist.fulfilled> = {
    type: deleteTodolist.fulfilled.type,
    payload: {
      todolistId: "todolistID2",
    },
  };

  const endState = tasksReducer(initialState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID2"]).not.toBeDefined();
});

test("tasks should be added for Todolist", () => {
  const action: Action<typeof fetchTasks.fulfilled> = {
    type: fetchTasks.fulfilled.type,
    payload: {
      tasks: initialState["todolistID1"],
      todolistId: "todolistID1",
    },
  };

  const endState = tasksReducer(
    {
      todolistID2: [],
      todolistID1: [],
    },
    action,
  );

  expect(endState["todolistID1"].length).toBe(3);
  expect(endState["todolistID2"].length).toBe(0);
});
