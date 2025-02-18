import { Bell, Home, Map, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Link from "next/link";

const items = [
  {
    title: "Crime Feed",
    url: "/",
    icon: Home,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Heat map",
    url: "/heatmap",
    icon: Map,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="backdrop-blur-xl  bg-transparent ">
      <SidebarContent className="flex bg-transparent flex-col pt-4 gap-6">
        <SidebarGroupContent className="px-4 mt-16">
          <SidebarMenu className="space-y-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.url}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium hidden md:inline-block">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
