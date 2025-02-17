import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
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
    icon: Inbox,
  },
  {
    title: "Heat map",
    url: "/heatmap",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-card backdrop-blur-xl z-50 border-r pt-3">
      <SidebarContent className="flex bg-card flex-col gap-6">
        <SidebarGroupLabel>
          <Link href="/" className="transition-opacity hover:opacity-80">
            <SidebarGroupLabel className="flex items-center gap-4 px-8 py-2">
              <Image
                src="/anticrime-logo.png"
                width={36}
                height={36}
                alt="AntiCrime logo"
                className="rounded-xl"
              />

              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden md:inline-block">
                AntiCrime
              </span>
            </SidebarGroupLabel>
          </Link>
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-4 mt-6">
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
