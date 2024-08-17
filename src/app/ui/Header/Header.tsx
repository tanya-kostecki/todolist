import React from "react";
import Toolbar from "@mui/material/Toolbar";
import { FilterButtonContainerSx } from "features/TodolistPage/ui/Todolist/TodoList";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { MenuButton } from "common/components/MenuButton/MenuButton";
import Switch from "@mui/material/Switch";
import { LinearProgress } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useSelector } from "react-redux";
import { logout, selectIsLoggedIn } from "features/login/model/authSlice";
import { useAppDispatch } from "app/model/store";
import { selectStatus } from "app/model/appSlice";
import { ThemeMode } from "app/ui/App";

type Theme = {
  palette: {
    mode: ThemeMode;
    primary: {
      main: string;
      dark: string;
    };
  };
};
type Props = {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
};
export const Header = ({ theme, themeMode, setThemeMode }: Props) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const status = useSelector(selectStatus);
  const dispatch = useAppDispatch();
  const changeModeHandler = () => setThemeMode(themeMode === "light" ? "dark" : "light");
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
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
  );
};
