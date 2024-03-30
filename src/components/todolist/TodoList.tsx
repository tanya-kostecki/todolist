import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { FilterValuesType, TaskType } from "../../App";
import { Button } from "../button/Button";

type TodoListPropsType = {
  tasks: TaskType[];
  removeTasks: (id: string) => void;
  changeFilter: (value: FilterValuesType) => void;
  title: string;
  removeAllTasks: () => void;
  addTask: (title: string) => void;
  changeTaskStatus: (taskId: string, taskStatus: boolean) => void;
  filter: string;
};
export function TodoList(props: TodoListPropsType) {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const addTaskHandler = () => {
    if (newTaskTitle.trim() !== "") {
      props.addTask(newTaskTitle.trim());
      setNewTaskTitle("");
    } else {
      setError("Title is required");
    }
  };

  const changeTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.currentTarget.value);
  };

  const addTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (event.key === "Enter") addTaskHandler();
  };

  const changeFilterTaskHandler = (filter: FilterValuesType) => {
    props.changeFilter(filter);
  };

  const removeAllTasksHandler = () => {
    props.removeAllTasks();
  };

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          className={error ? "error" : ""}
          value={newTaskTitle}
          onChange={changeTaskTitle}
          onKeyUp={addTaskOnEnterHandler}
        />
        <Button title="+" onClick={addTaskHandler} />
        {error && <div className="error-message">{error}</div>}
      </div>
      {!props.tasks.length ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {props.tasks.map((task) => {
            const removeTaskHandler = () => {
              props.removeTasks(task.id);
            };

            const changeTaskStatusHandler = (
              event: ChangeEvent<HTMLInputElement>
            ) => {
              const newTaskStatus = event.currentTarget.checked;
              props.changeTaskStatus(task.id, newTaskStatus);
            };

            return (
              <li key={task.id} className={task.isDone ? "is-done" : ""}>
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={changeTaskStatusHandler}
                />
                <span>{task.title}</span>
                <Button onClick={removeTaskHandler} title={"x"} />
              </li>
            );
          })}
        </ul>
      )}

      <Button title="Delete All Tasks" onClick={removeAllTasksHandler} />

      <div>
        <Button
          className={props.filter === "all" ? "active-filter" : ""}
          title="All"
          onClick={() => changeFilterTaskHandler("all")}
        />
        <Button
          className={props.filter === "active" ? "active-filter" : ""}
          title="Active"
          onClick={() => changeFilterTaskHandler("active")}
        />
        <Button
          className={props.filter === "completed" ? "active-filter" : ""}
          title="Completed"
          onClick={() => changeFilterTaskHandler("completed")}
        />
      </div>
    </div>
  );
}
