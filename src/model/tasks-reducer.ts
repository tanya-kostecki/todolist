import {TaskStateType} from "../AppLesson";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
export type SetTasksActionType = ReturnType<typeof setTasksAC>;
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;

type ActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskTitleActionType
    | ChangeTaskStatusActionType
    | AddTodolistActionType
    | RemoveTodolistActionType |
    SetTodolistsActionType | SetTasksActionType | UpdateTaskActionType

const initialState: TaskStateType = {};

export const tasksReducer = (
    state: TaskStateType = initialState,
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
            const copyState = {...state}
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
        default:
            return state
    }
};

export const removeTaskAC = (todolistId: string, taskId: string) => ({
    type: "REMOVE-TASK",
    payload: {todolistId, taskId,}
} as const)
export const addTaskAC = (task: TaskType) => ({type: "ADD-TASK", payload: {task}} as const)
export const changeTaskTitleAC = (
    todolistId: string,
    taskId: string,
    title: string
) => ({type: "CHANGE-TASK-TITLE", payload: {todolistId, taskId, title}} as const)

export const changeTaskStatusAC = (
    todolistId: string,
    taskId: string,
    status: TaskStatuses
) => ({type: "CHANGE-TASK-STATUS", payload: {todolistId, taskId, status}} as const)

export const updateTaskAC = (
    todolistId: string,
    taskId: string,
    model: UpdateTaskModelType
) => ({type: "UPDATE-TASK", payload: {todolistId, taskId, model}} as const);

export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: 'SET-TASKS',
    payload: {todolistId, tasks}
} as const)

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistApi.getTasks(todolistId).then(res => dispatch(setTasksAC(todolistId, res.data.items)));
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTask(todolistId, taskId).then(res => dispatch(removeTaskAC(todolistId, taskId)));
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.createTask(todolistId, title).then(res => dispatch(addTaskAC(res.data.data.item)));
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
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
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

            todolistApi.updateTask(todolistId, taskId, apiModel).then(res => dispatch(updateTaskAC(todolistId, taskId, apiModel))
            )
        }
    }
