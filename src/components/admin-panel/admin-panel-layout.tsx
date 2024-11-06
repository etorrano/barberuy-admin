"use client";

import { cn } from "@/lib/utils";
import { useStore } from "../../hooks/use-store";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";
import { useSidebarToggle } from "../../hooks/use-sidebar-toggle";
import { Toaster } from "../ui/toaster";
import { Outlet } from "react-router-dom";

export default function AdminPanelLayout() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Toaster />
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_33px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar.isOpen === false ? "lg:ml-[91px]" : "lg:ml-[18rem]"
        )}
      >
        <Outlet />
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar.isOpen === false ? "lg:ml-[5.75rem] h-0" : "lg:ml-72 h-0"
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
