import React, { useCallback, useState } from "react";
import "./App.css";
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
// import { v1 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./model/store";
import { changeFilterAC, removeTodolistAC, addTodolistAC, updateTodolistTitleAC } from "./model/todolists-reducer";
import { addTaskAC, changeTaskTitleAC, changeTaskStatusAC, removeTaskAC } from "./model/tasks-reducer";
import { TodoList } from "./components/todolist/TodoList";

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
function AppLesson() {
    // let todolistId1 = v1();
    // let todolistId2 = v1();

  const todolists = useSelector<AppRootStateType, TodolistType[]>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );
  
  const dispatch = useDispatch();

  const changeFilter = useCallback((todolistID: string, filter: FilterValuesType) => {
    dispatch(changeFilterAC(todolistID, filter));
  }, [dispatch]);

  const removeTasks = useCallback((todolistID: string, taskID: string) => {
    dispatch(removeTaskAC(todolistID, taskID));
  }, [dispatch]);

  const changeTaskStatus = useCallback((todolistID: string, taskID: string, newTaskStatus: boolean) => {
    dispatch(
      changeTaskStatusAC(todolistID, taskID, newTaskStatus)
    );
  }, [dispatch]);

  const removeTodolist = useCallback((todolistID: string) => {
    dispatch(removeTodolistAC(todolistID));
  }, [dispatch]);

  const addTask = useCallback((todolistID: string, title: string) => {
    dispatch(addTaskAC(todolistID, title));
  }, [dispatch]);

  const updateTaskTitle = useCallback((todolistID: string, taskID: string, newTitle: string) => {
    dispatch(changeTaskTitleAC(todolistID, taskID, newTitle));
  }, [dispatch]);

  const updateTodolistTitle = useCallback((todolistID: string, newTitle: string) => {
    dispatch(updateTodolistTitleAC(todolistID, newTitle));
  }, [dispatch]);
  
  const addTodolist = useCallback((title: string) => {
    let action = addTodolistAC(title);
    dispatch(action);
  }, [dispatch]);

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
            return (
              <Grid item key={tl.id}>
                <Paper elevation={5} sx={{ p: "20px" }}>
                    <TodoList
                    key={tl.id}
                    todolistID={tl.id}
                    tasks={tasks[tl.id]}
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

export default AppLesson;