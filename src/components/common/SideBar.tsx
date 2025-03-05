import {  BriefcaseBusiness, ListTodo } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect } from 'react'
import { useThemeStore } from '../../store/theme-store'
import { ThemeToggle } from '../ThemeToggle'


// Menu items.
const items = [
  {
    title: "Task Board",
    url: "/",
    icon: ListTodo,
  },
  {
    title: "DashBoard",
    url: "/dashboard",
    icon: BriefcaseBusiness,
  },
];

export function AppSidebar() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])


  return (
    <Sidebar className=" bg-red-500 border-none">
      <SidebarHeader className="flex flex-row w-full font-bold items-center  ">
        <img src="/images/logo.svg" alt="Logo TaskMaster" />
        TaskMaster
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon size={64} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4">
        <ThemeToggle />
      </div>
    </Sidebar>
  );
}
