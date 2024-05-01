import { v1 } from "uuid";
import { TaskStateType } from "../App";
import { AddTodolistActionType, RemoveTodolistActionType } from "./todolists-reducer";
import { todolistID1, todolistID2 } from "./todolists-reducer";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;

export type AddTaskActionType = ReturnType<typeof addTaskAC>;

export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;

export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskTitleActionType
  | ChangeTaskStatusActionType
  | AddTodolistActionType
  | RemoveTodolistActionType


const initialState: TaskStateType = {
  [todolistID1]: [
    { id: v1(), title: "HTML&CSS", isDone: true },
    { id: v1(), title: "JS", isDone: true },
    { id: v1(), title: "ReactJS", isDone: false },
  ],
  [todolistID2]: [
    { id: v1(), title: "Rest API", isDone: true },
    { id: v1(), title: "GraphQL", isDone: false },
  ],
};

export const tasksReducer = (
  state = initialState,
  action: ActionsType
): TaskStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          (task) => task.id !== action.payload.taskId
        ),
      };
    }
    case "ADD-TASK": {
      const newTask = { id: v1(), title: action.payload.title, isDone: false };
      return {
        ...state,
        [action.payload.todolistId]: [
          newTask,
          ...state[action.payload.todolistId],
        ],
      };
    }
    case "CHANGE-TASK-TITLE": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId
            ? { ...t, title: action.payload.title }
            : t
        ),
      };
    }
    case "CHANGE-TASK-STATUS": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId
            ? { ...t, isDone: action.payload.isDone }
            : t
        ),
      };
    }
    case 'ADD-TODOLIST': {
        return {...state, [action.payload.todolistId]: []}
    }
    case 'REMOVE-TODOLIST': {
        let copyState = {...state}
        delete copyState[action.payload.id]
        return copyState
    }
    default: return state
  }
};

//AC = action creators
export const removeTaskAC = (todolistId: string, taskId: string) => {
  return {
    type: "REMOVE-TASK",
    payload: {
      todolistId,
      taskId,
    },
  } as const;
};

export const addTaskAC = (todolistId: string, title: string) => {
  return {
    type: "ADD-TASK",
    payload: {
      todolistId,
      title,
    },
  } as const;
};

export const changeTaskTitleAC = (
  todolistId: string,
  taskId: string,
  title: string
) => {
  return {
    type: "CHANGE-TASK-TITLE",
    payload: {
      todolistId,
      taskId,
      title,
    },
  } as const;
};

export const changeTaskStatusAC = (
  todolistId: string,
  taskId: string,
  isDone: boolean
) => {
  return {
    type: "CHANGE-TASK-STATUS",
    payload: {
      todolistId,
      taskId,
      isDone,
    },
  } as const;
};
