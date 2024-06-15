import {TaskStateType} from "../AppLesson";
import {
    AddTodolistActionType, ClearDataActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatus, SetStatusType} from "./app-reducer";
import {handleAppError, handleNetworkServerError} from "../utils/ErrorUtils";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type SetTasksActionType = ReturnType<typeof setTasksAC>;
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
type SEtTaskEntityStatusActionType = ReturnType<typeof setTaskEntityStatusAC>;

type TaskActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType
    | UpdateTaskActionType
    | SEtTaskEntityStatusActionType
    | ClearDataActionType
    | SetStatusType

const initialState: TaskStateType = {};

export const tasksReducer = (
    state: TaskStateType = initialState,
    action: TaskActionsType
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
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
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
        case "SET-TODOLISTS": {
            const copyState: TaskStateType = {...state}
            action.payload.todolists.forEach(todo => {
                return copyState[todo.id] = []
            })
            return copyState
        }
        case "SET-TASKS": {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(task => task.id === action.payload.taskId
                        ? {...task, ...action.payload.model}
                        : task)
            }
        }
        case "SET-TASK-ENTITY-STATUS": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    entityStatus: action.payload.entityStatus
                } : t)
            }
        }
        case "CLEAR-DATA": {
            return {}
        }
        default:
            return state
    }
};

export const removeTaskAC = (todolistId: string, taskId: string) => ({
    type: "REMOVE-TASK",
    payload: {todolistId, taskId,}
} as const)
export const addTaskAC = (task: TaskType) => ({type: "ADD-TASK", payload: {task}} as const)
export const updateTaskAC = (
    todolistId: string,
    taskId: string,
    model: UpdateTaskModelType
) => ({type: "UPDATE-TASK", payload: {todolistId, taskId, model}} as const);

export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: 'SET-TASKS',
    payload: {todolistId, tasks}
} as const)

export const setTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {
        type: 'SET-TASK-ENTITY-STATUS',
        payload: {todolistId, taskId, entityStatus}
    } as const
}

//thunk creators
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<TaskActionsType>) => {
    dispatch(setAppStatus('loading'))
    todolistApi.getTasks(todolistId).then(res => {
        dispatch(setTasksAC(todolistId, res.data.items))
        dispatch(setAppStatus('succeeded'))
    }).catch(err => handleNetworkServerError(dispatch, err))
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<TaskActionsType>) => {
    dispatch(setAppStatus('loading'))
    dispatch((setTaskEntityStatusAC(todolistId, taskId, 'loading')))
    todolistApi.deleteTask(todolistId, taskId).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatus('succeeded'))
            dispatch((setTaskEntityStatusAC(todolistId, taskId, 'succeeded')))
        } else {
            handleAppError(dispatch, res.data)
        }

    }).catch(err => handleNetworkServerError(dispatch, err))
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<TaskActionsType>) => {
    dispatch(setAppStatus('loading'))
    todolistApi.createTask(todolistId, title).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleAppError(dispatch, res.data)
        }

    }).catch(err => handleNetworkServerError(dispatch, err))
}

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<TaskActionsType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatus('loading'))
        dispatch((setTaskEntityStatusAC(todolistId, taskId, 'loading')))
        const tasks = getState().tasks
        const task = tasks[todolistId].find((t) => t.id === taskId);
        if (task) {
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                deadline: task.deadline,
                priority: task.priority,
                startDate: task.startDate,
                status: task.status,
                ...domainModel
            }

            todolistApi.updateTask(todolistId, taskId, apiModel).then(res => {
                dispatch(updateTaskAC(todolistId, taskId, apiModel))
                dispatch(setAppStatus('succeeded'))
                dispatch((setTaskEntityStatusAC(todolistId, taskId, 'succeeded')))
            }).catch(err => handleNetworkServerError(dispatch, err))
        }
    }
