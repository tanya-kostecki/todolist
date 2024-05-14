import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";
import { combineReducers, legacy_createStore as createStore } from "redux";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = createStore(rootReducer)

export type AppRootStateType = ReturnType<typeof rootReducer>

//@ts-ignore
window.store = store

// {
//     state: {
//         tasks: {},
//         todolists: []
//     },
//     getState()
//     dispatch()
//     subscribe()
// }