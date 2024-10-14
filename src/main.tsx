import { StrictMode } from "react";
import { createRoot } from "react-dom/client";import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.scss";
import UsersPage from "./pages/users/Users.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UsersPage/>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

