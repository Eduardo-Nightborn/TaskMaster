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

  return (
    <Sidebar className=" bg-red-500 border-none">
      <SidebarHeader className="flex flex-row w-full font-bold ">
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
    </Sidebar>
  );
}
