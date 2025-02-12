import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Crime Feed",
    url: "/feed",
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
    title: "Emergency Contact",
    url: "/emergency-contact/as",
    icon: Search,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <Link href={"/feed"}>
            <SidebarGroupLabel className="my-4">
              <Image
                src={"/anticrime-logo.png"}
                width={40}
                height={40}
                alt="logo"
              />
              <span className="text-sm font-semibold">AntiCrime</span>
            </SidebarGroupLabel>
          </Link>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
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
