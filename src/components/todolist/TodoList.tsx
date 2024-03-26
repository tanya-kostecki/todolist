import React from 'react'
import { FilterValuesType, TaskType } from '../../App'

type TodoListPropsType = {
    tasks: TaskType[]
    removeTasks: (id: number) => void
    changeFilter: (value: FilterValuesType) => void
    title: string
}
export function TodoList(props: TodoListPropsType) {
  return (  
     <div>
        <h3>{props.title}</h3>
        <div>
            <input/>
            <button>+</button>
        </div>
        {props.tasks.length === 0 ? (
            <p>No tasks</p>
        ) : (
            <ul>
                {props.tasks.map(task => 
                    (<li key={task.id}>
                        <input type="checkbox" defaultChecked={task.isDone}/>
                        <span>{task.title}</span>
                        <button onClick={() => props.removeTasks(task.id)}>x</button>
                    </li>))}
            </ul>
        )}
        
        <div>
            <button onClick={() => props.changeFilter('all')}>All</button>
            <button onClick={() => props.changeFilter('active')}>Active</button>
            <button onClick={() => props.changeFilter('completed')}>Completed</button>
        </div>
    </div>
  )
}
