import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.scss";
import UsersPage from "./pages/users/users.tsx";
import { getUsers, getWorkshifts } from "./api/client.ts";
import UsersFormPage from "./pages/users/users-form.tsx";
import WorkshiftsFormPage from "./pages/workshifts/workshifts-form.tsx";
import WorkshiftsPage from "./pages/workshifts/workshifts.tsx";

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
    path: "/turnos",
    element: <WorkshiftsPage />,
    loader: async () => {
      return getWorkshifts();
    },
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
