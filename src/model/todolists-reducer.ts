import { v1 } from "uuid";
import { TodolistType, FilterValuesType } from "../App";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
      id: string
    }
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        title: string,
        todolistId: string
    }
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterValuesType
    }
}

export type ActionsType =
| RemoveTodolistActionType
| AddTodolistActionType
| ChangeTodolistTitleActionType
| ChangeTodolistFilterActionType

export let todolistID1 = v1();
export let todolistID2 = v1();

// const initialState: TodolistType[] = [
// { id: todolistID1, title: "What to learn", filter: "all" },
// { id: todolistID2, title: "What to buy", filter: "all" },
// ];

const initialState: TodolistType[] = [];


export const todolistsReducer = (state: Array<TodolistType> = initialState, action: ActionsType): Array<TodolistType> => {
    switch(action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter((tl) => tl.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistType = {
                id: action.payload.todolistId,
                title: action.payload.title,
                filter: "all",
            };
            return [...state, newTodolist]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map((todo) =>
                todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo
              )
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map((tl) =>
                tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl
              )
        }
        default: return state
    }
}

//AC = action creators
export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id,
        },
    } as const
}

export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
          title,
          todolistId: v1()
        },
    } as const
}

export const updateTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
          id,
          title,
        },
      } as const
}

export const changeFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
          id,
          filter,
        },
      } as const
}




