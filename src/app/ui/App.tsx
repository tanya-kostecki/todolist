import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppDispatch } from "app/model/store";
import { CircularProgress } from "@mui/material";
import { selectIsInitialized } from "app/model/appSlice";
import { me } from "features/login/model/authSlice";
import { useSelector } from "react-redux";
import { CustomizedSnackbars } from "common/components";
import { TaskType } from "features/TodolistPage/api/tasksApi.types";
import { Header } from "app/ui/Header/Header";
import { Routing } from "app/ui/Routing/Routing";

export type ThemeMode = "dark" | "light";
export type TaskStateType = Record<string, TaskType[]>;
export type FilterValuesType = "all" | "completed" | "active";

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const isInitialized = useSelector(selectIsInitialized);

  const dispatch = useAppDispatch();

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

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomizedSnackbars />
      <Header theme={theme} setThemeMode={setThemeMode} themeMode={themeMode} />
      <Routing />
    </ThemeProvider>
  );
}

export default App;
