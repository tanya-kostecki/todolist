import React, { useReducer, useState } from "react";
import "./App.css";
import { TodoList } from "./components/todolist/TodoList";
import { v1 } from "uuid";
import { AddItemForm } from "./components/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { FilterButtonContainerSx } from "./components/todolist/Todolist.styles";
import { MenuButton } from "./components/MenuButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import CssBaseline from "@mui/material/CssBaseline";
import {
  addTodolistAC,
  changeFilterAC,
  removeTodolistAC,
  todolistsReducer,
  updateTodolistTitleAC,
} from "./model/todolists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  removeTaskAC,
  tasksReducer,
  changeTaskTitleAC,
} from "./model/tasks-reducer";

type ThemeMode = "dark" | "light";

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
function AppWithReducers() {
  let todolistID1 = v1();
  let todolistID2 = v1();

  const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
    { id: todolistID1, title: "What to learn", filter: "all" },
    { id: todolistID2, title: "What to buy", filter: "all" },
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
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

  const changeFilter = (todolistID: string, value: FilterValuesType) =>
    dispatchToTodolists(changeFilterAC(todolistID, value));

  const removeTasks = (todolistID: string, id: string) =>
    dispatchToTasks(removeTaskAC(todolistID, id));

  const addTask = (todolistID: string, title: string) =>
    dispatchToTasks(addTaskAC(todolistID, title));

  const changeTaskStatus = (
    todolistID: string,
    taskId: string,
    taskStatus: boolean
  ) => dispatchToTasks(changeTaskStatusAC(todolistID, taskId, taskStatus));

  const removeTodolist = (todolistID: string) => {
    let action = removeTodolistAC(todolistID)
    dispatchToTodolists(action);
    dispatchToTasks(action);
  };

  const addTodolist = (title: string) => {
    let action = addTodolistAC(title)
    dispatchToTodolists(action);
    dispatchToTasks(action);
  };

  const updateTaskTitle = (
    todoListID: string,
    taskID: string,
    newTitle: string
  ) => dispatchToTasks(changeTaskTitleAC(todoListID, taskID, newTitle));

  const updateTodolistTitle = (todoListID: string, newTitle: string) =>
    dispatchToTodolists(updateTodolistTitleAC(todoListID, newTitle));

  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  const changeModeHandler = () =>
    setThemeMode(themeMode === "light" ? "dark" : "light");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: "30px" }}>
        <Toolbar sx={FilterButtonContainerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <MenuButton background={theme.palette.primary.dark}>
              Login
            </MenuButton>
            <MenuButton background={theme.palette.primary.dark}>
              Logout
            </MenuButton>
            <MenuButton background={theme.palette.primary.light}>
              Faq
            </MenuButton>
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Grid container sx={{ mb: "30px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={4}>
          {todolists.map((tl) => {
            let filteredTasks = tasks[tl.id];
            if (tl.filter === "completed") {
              filteredTasks = tasks[tl.id].filter(
                (task) => task.isDone === true
              );
            }

            if (tl.filter === "active") {
              filteredTasks = tasks[tl.id].filter(
                (task) => task.isDone === false
              );
            }
            return (
              <Grid item key={tl.id}>
                <Paper elevation={5} sx={{ p: "20px" }}>
                  <TodoList
                    // key={tl.id}
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
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default AppWithReducers;
