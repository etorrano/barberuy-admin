import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.scss";
import UsersPage from "./pages/users/users.tsx";
import { getUsers } from "./api/client.ts";

const router = createBrowserRouter([
  {
    path: "/usuarios",
    element: <UsersPage />,
    loader: async () => {
      return getUsers();
    },
  },
  /*  {
    path: "/usuarios/nuevo",
    element: <UsersPage />,
  }, */
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
