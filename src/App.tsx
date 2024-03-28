import React, { useState} from 'react';
import './App.css';
import { TodoList } from './components/todolist/TodoList';
import { v1 } from 'uuid';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = 'all' | 'completed' | 'active'
function App() {
    const [tasks, setTasks] = useState<TaskType[]>([
        { id: v1(), title: 'HTML&CSS', isDone: true },
        { id: v1(), title: 'JS', isDone: true },
        { id: v1(), title: 'React', isDone: false },
        { id: v1(), title: 'Redux', isDone: false },
    ])

    const [filter, setFilter] = useState<FilterValuesType>('all')

    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }

    let filteredTasks = tasks
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.isDone === true)
    }

    if (filter === 'active') {
        filteredTasks = tasks.filter(task => task.isDone === false)
    }

    const removeTasks = (id: string) => {
        const filteredTasks = tasks.filter(task => task.id !== id)
        setTasks(filteredTasks)
    }

    //Delete All Tasks
    const removeAllTasks = () => {
        setTasks([])
    }

    const addTask = (title: string) => {
        const newTask = { id: v1(), title: title, isDone: false}
        const updatedTasks = [newTask, ...tasks]
        setTasks(updatedTasks)
    }
    return (
        <div className="App">
           <TodoList tasks={filteredTasks} title='What to learn' removeTasks={removeTasks} changeFilter={changeFilter} removeAllTasks={removeAllTasks} addTask={addTask}/>
        </div>
    );
}

export default App;
