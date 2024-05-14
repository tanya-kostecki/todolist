import { TaskStateType } from "../App";
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from "./tasks-reducer";
import { addTodolistAC, removeTodolistAC } from "./todolists-reducer";

let initialState: TaskStateType
beforeEach(() => {
   initialState = {
        "todolistID1": [
        { id: '1', title: "HTML&CSS", isDone: true },
        { id: '2', title: "JS", isDone: false },
        { id: '3', title: "ReactJS", isDone: false },
        ],
        "todolistID2": [
        { id: '1', title: "Rest API", isDone: true },
        { id: '2', title: "GraphQL", isDone: false },
        { id: '3', title: "Milk", isDone: false },
        ],
    };
})

test('correct task should be deleted', () => {
    const endState = tasksReducer(initialState, removeTaskAC('todolistID2','2'))

    expect(endState).toStrictEqual({
        "todolistID1": [
        { id: '1', title: "HTML&CSS", isDone: true },
        { id: '2', title: "JS", isDone: false },
        { id: '3', title: "ReactJS", isDone: false },
        ],
        "todolistID2": [
            { id: '1', title: "Rest API", isDone: true },
            { id: '3', title: "Milk", isDone: false },
        ],
    })
})

test('correct task should be added to correct todolist', () => {
    const endState = tasksReducer(initialState, addTaskAC('todolistID2','Juice'))

    expect(endState['todolistID1'].length).toBe(3)
    expect(endState['todolistID2'].length).toBe(4)
    expect(endState['todolistID2'][0].id).toBeDefined()
    expect(endState['todolistID2'][0].title).toBe('Juice')
    expect(endState['todolistID2'][0].isDone).toBe(false)
})

test('status of specified task should be changed', () => {
    const endState = tasksReducer(initialState, changeTaskStatusAC('todolistID2','2', true))

    expect(endState['todolistID2'][1].isDone).toBe(true)
    expect(endState['todolistID1'][1].isDone).toBe(false)
    expect(endState['todolistID2'][1].title).toBe('GraphQL')
})

test('title of specified task should be changed', () => {
    const endState = tasksReducer(initialState, changeTaskTitleAC('todolistID2','2', 'Bread'))

    expect(endState['todolistID2'][1].title).toBe('Bread')
    expect(endState['todolistID1'][1].title).toBe('JS')
})

test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC('new todolist')

    const endState = tasksReducer(initialState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistID1' && k !== 'todolistID2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC('todolistID2')

    const endState = tasksReducer(initialState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistID2']).not.toBeDefined()
})