import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.scss";
import UsersPage from "./pages/users/users.tsx";
import { getUsers } from "./api/client.ts";
import UsersFormPage from "./pages/users/users-form.tsx";
import WorkshiftsFormPage from "./pages/workshifts/workshifts-form.tsx";

const router = createBrowserRouter([
  {
    path: "/usuarios",
    element: <UsersPage />,
    loader: async () => {
      return getUsers();
    },
  },
  {
    path: "/usuarios/nuevo",
    element: <UsersFormPage />,
  },
  {
    path: "/turnos/nuevo",
    element: <WorkshiftsFormPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
