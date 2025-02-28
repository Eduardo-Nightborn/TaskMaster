import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import TaskBoardPage from "./pages/TaskBoardPage.tsx";
import TaskFormPage from "./pages/TaskFormPage.tsx";
import DashBoardPage from "./pages/DashBoard.tsx";
import { AppSidebar } from "@/components/common/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <TaskBoardPage />,
      },
      {
        path: "create",
        element: <TaskFormPage />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashBoardPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <>
        <AppSidebar />
        <SidebarTrigger className=" ml-1 cursor-pointer" />
        <RouterProvider router={router} />
        <Toaster/>
      </>
    </SidebarProvider>
  </StrictMode>
);
