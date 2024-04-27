import { addTodolistAC, changeFilterAC, removeTodolistAC, todolistsReducer, updateTodolistTitleAC } from "./todolists-reducer"
import { v1 } from "uuid"
import { TodolistType } from "../App"

test('correct todolist should be removed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()
   
    //start state
    const startState: TodolistType[] = [
      { id: todolistId1, title: 'What to learn', filter: 'all' },
      { id: todolistId2, title: 'What to buy', filter: 'all' },
    ]
  
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))
   
    //expected results
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()
   
    //start state
    const startState: TodolistType[] = [
      { id: todolistId1, title: 'What to learn', filter: 'all' },
      { id: todolistId2, title: 'What to buy', filter: 'all' },
    ]
   
    const endState = todolistsReducer(startState, addTodolistAC('New Todolist'))
   
    //expected results
    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe('New Todolist')
})

test('correct todolist should change its name', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()
   
    //start state
    const startState: TodolistType[] = [
      { id: todolistId1, title: 'What to learn', filter: 'all' },
      { id: todolistId2, title: 'What to buy', filter: 'all' },
    ]
   
    //action
    // const action = {
    //   type: 'CHANGE-TODOLIST-TITLE',
    //   payload: {
    //     id: todolistId2,
    //     title: 'New Title',
    //   },
    // } as const
    const endState = todolistsReducer(startState, updateTodolistTitleAC(todolistId2, 'New Title'))
   
    //expected results
    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe('New Title')
})

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()
   
    //start state
    const startState: TodolistType[] = [
      { id: todolistId1, title: 'What to learn', filter: 'all' },
      { id: todolistId2, title: 'What to buy', filter: 'all' },
    ]
   
    //action
    // const action = {
    //   type: 'CHANGE-TODOLIST-FILTER',
    //   payload: {
    //     id: todolistId2,
    //     filter: 'completed',
    //   },
    // } as const
    const endState = todolistsReducer(startState, changeFilterAC(todolistId2, 'completed'))
   
    //expected results
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('completed')
})