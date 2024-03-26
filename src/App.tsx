import React, { useState} from 'react';
import './App.css';
import { TodoList } from './components/todolist/TodoList';

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}

export type FilterValuesType = 'all' | 'completed' | 'active'
function App() {
    const [tasks, setTasks] = useState<TaskType[]>([
        { id: 1, title: 'HTML&CSS', isDone: true },
        { id: 2, title: 'JS', isDone: true },
        { id: 3, title: 'React', isDone: false },
        { id: 4, title: 'Redux', isDone: false },
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

    const removeTasks = (id: number) => {
        const filteredTasks = tasks.filter(task => task.id !== id)
        setTasks(filteredTasks)
    } 
    return (
        <div className="App">
           <TodoList tasks={filteredTasks} title='What to learn' removeTasks={removeTasks} changeFilter={changeFilter}/>
        </div>
    );
}

export default App;
