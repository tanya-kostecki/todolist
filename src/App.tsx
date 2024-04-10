import React, { useState} from 'react';
import './App.css';
import { TodoList } from './components/todolist/TodoList';
import { v1 } from 'uuid';
import { AddItemForm } from "./components/AddItemForm";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
export type TaskStateType = {
  [key: string]: TaskType[];
};
export type FilterValuesType = "all" | "completed" | "active";
function App() {
  let todolistID1 = v1();
  let todolistID2 = v1();

  const [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolistID1, title: "What to learn", filter: "all" },
    { id: todolistID2, title: "What to buy", filter: "all" },
  ]);

  const [tasks, setTasks] = useState<TaskStateType>({
    [todolistID1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false },
    ],
    [todolistID2]: [
      { id: v1(), title: "Rest API", isDone: true },
      { id: v1(), title: "GraphQL", isDone: false },
    ],
  });

  const changeFilter = (todolistID: string, value: FilterValuesType) => {
    setTodolists(
      todolists.map((tl) =>
        tl.id === todolistID ? { ...tl, filter: value } : tl
      )
    );
  };

  const removeTasks = (todolistID: string, id: string) => {
    setTasks({
      ...tasks,
      [todolistID]: tasks[todolistID].filter((task) => task.id !== id),
    });
  };

  const addTask = (todolistID: string, title: string) => {
    const newTask = { id: v1(), title: title, isDone: false };
    setTasks({ ...tasks, [todolistID]: [newTask, ...tasks[todolistID]] });
  };

  const changeTaskStatus = (
    todolistID: string,
    taskId: string,
    taskStatus: boolean
  ) => {
    setTasks({
      ...tasks,
      [todolistID]: tasks[todolistID].map((task) =>
        task.id === taskId ? { ...task, isDone: taskStatus } : task
      ),
    });
  };

  const removeTodolist = (todolistID: string) => {
    setTodolists(todolists.filter((tl) => tl.id !== todolistID));
    delete tasks[todolistID];
    setTasks({ ...tasks });
  };

  const addTodolist = (title: string) => {
    const newTodoId = v1();
    const newTodolist: TodolistType = {
      id: newTodoId,
      title: title,
      filter: "all",
    };
    setTodolists([newTodolist, ...todolists]);
    setTasks({ ...tasks, [newTodoId]: [] });
  };

  const updateTaskTitle = (
    todoListID: string,
    taskID: string,
    newTitle: string
  ) => {
    setTasks({
      ...tasks,
      [todoListID]: tasks[todoListID].map((task) =>
        task.id === taskID ? { ...task, title: newTitle } : task
      ),
    });
  };

  const updateTodolistTitle = (todoListID: string, newTitle: string) => {
    setTodolists(
      todolists.map((todo) =>
        todo.id === todoListID ? { ...todo, title: newTitle } : todo
      )
    );
  };

  return (
    <div className="App">
      <AddItemForm addItem={addTodolist} />
      {todolists.map((tl) => {
        let filteredTasks = tasks[tl.id];
        if (tl.filter === "completed") {
          filteredTasks = tasks[tl.id].filter((task) => task.isDone === true);
        }

        if (tl.filter === "active") {
          filteredTasks = tasks[tl.id].filter((task) => task.isDone === false);
        }
        return (
          <TodoList
            key={tl.id}
            todolistID={tl.id}
            tasks={filteredTasks}
            title={tl.title}
            removeTasks={removeTasks}
            changeFilter={changeFilter}
            filter={tl.filter}
            addTask={addTask}
            changeTaskStatus={changeTaskStatus}
            removeTodolist={removeTodolist}
            updateTaskTitle={updateTaskTitle}
            updateTodolistTitle={updateTodolistTitle}
          />
        );
      })}
    </div>
  );
}

export default App;
