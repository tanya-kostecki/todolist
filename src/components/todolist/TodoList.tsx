import React, { ChangeEvent } from "react";
import { FilterValuesType, TaskType } from "../../App";
import { Button } from "../button/Button";
import { AddItemForm } from "../AddItemForm";
import { EditableSpan } from "../EditableSpan";

type TodoListPropsType = {
  todolistID: string;
  tasks: TaskType[];
  removeTasks: (todolistID: string, id: string) => void;
  changeFilter: (todolistID: string, value: FilterValuesType) => void;
  title: string;
  addTask: (todolistID: string, title: string) => void;
  changeTaskStatus: (
    todolistID: string,
    taskId: string,
    taskStatus: boolean
  ) => void;
  filter: string;
  removeTodolist: (todolistID: string) => void;

  updateTaskTitle: (
    todoListID: string,
    taskID: string,
    newTitle: string
  ) => void;
  updateTodolistTitle: (todolistID: string, newTitle: string) => void;
};
export function TodoList(props: TodoListPropsType) {
  const changeFilterTaskHandler = (filter: FilterValuesType) => {
    props.changeFilter(props.todolistID, filter);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.todolistID);
  };

  const addTaskHandler = (title: string) => {
    props.addTask(props.todolistID, title);
  };

  const updateTaskTitleHandler = (taskID: string, newTitle: string) => {
    props.updateTaskTitle(props.todolistID, taskID, newTitle);
  };

  const updateTodolistTitleHandler = (newTitle: string) => {
    props.updateTodolistTitle(props.todolistID, newTitle);
  };

  return (
    <div>
      <h3>
        <EditableSpan
          oldTitle={props.title}
          updateTitle={updateTodolistTitleHandler}
        />
        <Button title="x" onClick={removeTodolistHandler} />
      </h3>
      <AddItemForm addItem={addTaskHandler} />

      {!props.tasks.length ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {props.tasks.map((task) => {
            const removeTaskHandler = () => {
              props.removeTasks(props.todolistID, task.id);
            };

            const changeTaskStatusHandler = (
              event: ChangeEvent<HTMLInputElement>
            ) => {
              const newTaskStatus = event.currentTarget.checked;
              props.changeTaskStatus(props.todolistID, task.id, newTaskStatus);
            };

            return (
              <li key={task.id} className={task.isDone ? "is-done" : ""}>
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={changeTaskStatusHandler}
                />
                <EditableSpan
                  oldTitle={task.title}
                  updateTitle={(newTitle: string) =>
                    updateTaskTitleHandler(task.id, newTitle)
                  }
                />
                <Button onClick={removeTaskHandler} title={"x"} />
              </li>
            );
          })}
        </ul>
      )}

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
