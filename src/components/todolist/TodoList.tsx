import React, { useState } from "react";
import { FilterValuesType, TaskType } from "../../App";
import { Button } from "./Button";

type TodoListPropsType = {
  tasks: TaskType[];
  removeTasks: (id: string) => void;
  changeFilter: (value: FilterValuesType) => void;
  title: string;
  removeAllTasks: () => void;
  addTask: (title: string) => void;
};
export function TodoList(props: TodoListPropsType) {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.currentTarget.value)}
        />
        <Button title="+" onClick={() => props.addTask(newTaskTitle)} />
      </div>
      {props.tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {props.tasks.map((task) => (
            <li key={task.id}>
              <input type="checkbox" checked={task.isDone} />
              <span>{task.title}</span>
              <Button title="x" onClick={() => props.removeTasks(task.id)} />
            </li>
          ))}
        </ul>
      )}

      <Button title="Delete All Tasks" onClick={props.removeAllTasks} />

      <div>
        <Button title="All" onClick={() => props.changeFilter("all")} />
        <Button title="Active" onClick={() => props.changeFilter("active")} />
        <Button
          title="Completed"
          onClick={() => props.changeFilter("completed")}
        />
      </div>
    </div>
  );
}
