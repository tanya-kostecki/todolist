import React, {useCallback, useEffect, useState} from "react";
import "./App.css";
import {AddItemForm} from "./components/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {FilterButtonContainerSx} from "./components/todolist/Todolist.styles";
import {MenuButton} from "./components/MenuButton";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import CssBaseline from "@mui/material/CssBaseline";
import {useAppDispatch, useAppSelector} from "./model/store";
import {
    changeFilterAC,
    getTodosTC, deleteTodosTC, createTodosTC, updateTodosTC
} from "./model/todolists-reducer";
import {
    deleteTaskTC,
    addTaskTC, updateTaskTC
} from "./model/tasks-reducer";
import {TodoList} from "./components/todolist/TodoList";
import {TaskStatuses, TaskType} from "./api/api";
import {CircularProgress, LinearProgress} from "@mui/material";
import {RequestStatusType} from "./model/app-reducer";
import {CustomizedSnackbars} from "./components/error-snackbar/ErrorSnackbar";
import {TodolistPage} from "./pages/todolist-page/TodolistPage";
import {Outlet} from "react-router-dom";
import {logoutTC, meTC} from "./model/auth-reducer";

type ThemeMode = "dark" | "light";

export type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
    entityStatus: RequestStatusType
};

export type TaskStateType = {
    [key: string]: TaskType[];
};
export type FilterValuesType = "all" | "completed" | "active";

function AppLesson() {

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

    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized);
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(meTC())
    }, []);


    if (!isInitialized) {
        return (
            <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
                <CircularProgress/>
            </div>
        )
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <CustomizedSnackbars/>
            <AppBar position="static" sx={{mb: "30px"}}>
                <Toolbar sx={FilterButtonContainerSx}>
                    <IconButton color="inherit">
                        <MenuIcon/>
                    </IconButton>
                    <div>
                        {isLoggedIn &&
                            <MenuButton onClick={logoutHandler} background={theme.palette.primary.dark}>
                                Logout
                            </MenuButton>}
                        <Switch color={"default"} onChange={changeModeHandler}/>
                    </div>
                </Toolbar>
                {status === 'loading' && <LinearProgress color={'secondary'}/>}
            </AppBar>

            <Container fixed>
                <Outlet/>
            </Container>
        </ThemeProvider>
    );
}

export default AppLesson;