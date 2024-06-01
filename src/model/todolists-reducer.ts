import {v1} from "uuid";
import {FilterValuesType} from "../AppLesson";
import {todolistApi, TodolistType} from "../api/api";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof updateTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistAC>

export type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

export let todolistID1 = v1();
export let todolistID2 = v1();

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
const initialState: TodolistDomainType[] = [];


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter((tl) => tl.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.payload.todolistId,
                title: action.payload.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map((todo) =>
                todo.id === action.payload.id ? {...todo, title: action.payload.title} : todo
            )
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map((tl) =>
                tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl
            )
        }
        case "SET-TODOLISTS": {
            return action.payload.todolists.map(todo => ({...todo, filter: "all"}))
        }
        default:
            return state
    }
}

//AC = action creators
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', payload: {id}} as const)
export const addTodolistAC = (title: string) => ({type: 'ADD-TODOLIST', payload: {title, todolistId: v1()}} as const)
export const updateTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {id, title,}
} as const)
export const changeFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {id, filter}
} as const)
export const setTodolistAC = (todolists: TodolistType[]) => ({type: 'SET-TODOLISTS', payload: {todolists}} as const)

//thunk creators
export const getTodosTC = () => (dispatch: Dispatch, getState: any) => {
    todolistApi.getTodolists().then(res => dispatch(setTodolistAC(res.data)));
}

export const deleteTodosTC = (todolistId: string) => (dispatch: Dispatch, getState: any) => {
    todolistApi.deleteTodolist(todolistId).then(res => dispatch(removeTodolistAC(todolistId)));
}

export const createTodosTC = (title: string) => (dispatch: Dispatch, getState: any) => {
    todolistApi.createTodolist(title).then(res => dispatch(addTodolistAC(title)));
}

export const updateTodosTC = (todolistId: string, title: string) => (dispatch: Dispatch, getState: any) => {
    todolistApi.updateTodolist(todolistId, title).then(res => dispatch(updateTodolistTitleAC(todolistId, title)));
}

