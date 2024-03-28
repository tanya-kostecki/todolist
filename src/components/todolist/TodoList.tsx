import React from 'react'
import { FilterValuesType, TaskType } from '../../App'
import { Button } from './Button'

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
            <Button title='+'/>
        </div>
        {props.tasks.length === 0 ? (
            <p>No tasks</p>
        ) : (
            <ul>
                {props.tasks.map(task => 
                    (<li key={task.id}>
                        <input type="checkbox" defaultChecked={task.isDone}/>
                        <span>{task.title}</span>
                        <Button title='x' onClick={() => props.removeTasks(task.id)}/>
                    </li>))}
            </ul>
        )}
        
        <div>
            <Button title='All' onClick={() => props.changeFilter('all')}/>
            <Button title='Active' onClick={() => props.changeFilter('active')}/>
            <Button title='Completed' onClick={() => props.changeFilter('completed')}/>
        </div>
    </div>
  )
}
