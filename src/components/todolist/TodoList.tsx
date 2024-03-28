import React, { ChangeEvent, KeyboardEvent, useState } from "react";
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

  const addTaskHandler = () => {
    props.addTask(newTaskTitle);
    setNewTaskTitle("");
  };

  const changeTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.currentTarget.value);
  };

  const addTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") addTaskHandler();
  };

  const changeFilterTaskHandler = (filter: FilterValuesType) => {
    props.changeFilter(filter);
  };

  const removeAllTasksHandler = () => {
    props.removeAllTasks()
  }
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={changeTaskTitle}
          onKeyUp={addTaskOnEnterHandler}
        />
        <Button title="+" onClick={addTaskHandler} />
      </div>
      {props.tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {props.tasks.map((task) => {
            const removeTaskHandler = () => {
              props.removeTasks(task.id);
            };

            return (
              <li key={task.id}>
                <input type="checkbox" checked={task.isDone} />
                <span>{task.title}</span>
                <Button onClick={removeTaskHandler} title={"x"} />
              </li>
            );
          })}
        </ul>
      )}

      <Button title="Delete All Tasks" onClick={removeAllTasksHandler} />

      <div>
        <Button title="All" onClick={() => changeFilterTaskHandler("all")} />
        <Button
          title="Active"
          onClick={() => changeFilterTaskHandler("active")}
        />
        <Button
          title="Completed"
          onClick={() => changeFilterTaskHandler("completed")}
        />
      </div>
    </div>
  );
}
