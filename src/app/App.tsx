import React, { useEffect, useState } from "react";
import "app/App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { FilterButtonContainerSx } from "features/TodolistPage/Todolist/Todolist.styles";
import { MenuButton } from "common/components/MenuButton/MenuButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppDispatch } from "app/store";
import { TaskType } from "features/TodolistPage/Todolist/todolistApi";
import { CircularProgress, LinearProgress } from "@mui/material";
import { RequestStatusType, selectIsInitialized, selectStatus } from "app/appSlice";
import { Outlet } from "react-router-dom";
import { logout, me, selectIsLoggedIn } from "features/login/model/authSlice";
import { useSelector } from "react-redux";
import { CustomizedSnackbars } from "common/components";

type ThemeMode = "dark" | "light";

export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export type TaskStateType = Record<string, TaskType[]>;
export type FilterValuesType = "all" | "completed" | "active";

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const status = useSelector(selectStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  const changeModeHandler = () => setThemeMode(themeMode === "light" ? "dark" : "light");

  useEffect(() => {
    dispatch(me());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomizedSnackbars />
      <AppBar position="static" sx={{ mb: "30px" }}>
        <Toolbar sx={FilterButtonContainerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && (
              <MenuButton onClick={logoutHandler} background={theme.palette.primary.dark}>
                Logout
              </MenuButton>
            )}
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
        {status === "loading" && <LinearProgress color={"secondary"} />}
      </AppBar>

      <Container fixed>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
