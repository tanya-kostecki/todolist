import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "App";
import { Provider } from "react-redux";
import { store } from "model/store";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Login } from "pages/login/Login";
import { TodolistPage } from "pages/todolist-page/TodolistPage";
import { ErrorPage } from "pages/error/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="/404" />,
    children: [
      {
        index: true,
        element: <Navigate to="/todolists" />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/todolists",
        element: <TodolistPage />,
      },
    ],
  },
  {
    path: "/404",
    element: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
