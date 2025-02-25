"use client";

import { Bell, Home, Map, User, Shield, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/api/useUser";
import { useSelector } from "react-redux";
import { useUnreadNotificationCount } from "@/hooks/api/useUnreadNotification";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";

const mainNavigation = [
  {
    title: "Crime Feed",
    url: "/",
    icon: Home,
  },
  {
    title: "Crime Map",
    url: "/heatmap",
    icon: Map,
    description: "",
  },
];

const quickActions = [
  {
    title: "Emergency Contacts",
    url: "/emergency",
    icon: Shield,
    variant: "outline" as const,
    description: "Access emergency contact numbers",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  useUnreadNotificationCount();

  const unreadCount = useSelector(
    (state: RootState) => state.notifications.unreadCount
  );
  const isAdmin = user?.role === "admin";
  const communitySection = [
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      description: "View alerts and updates",
      badge: unreadCount,
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: User,
      description: "View your profile",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      description: "Manage your account settings",
    },
  ];

  const adminSection = [
    {
      title: "Admin",
      url: "/admin",
      description: "Manage your admin settings",
      icon: Shield,
    },
  ];

  return (
    <Sidebar className="backdrop-blur-xl bg-white/50 border-r border-border/40">
      <SidebarContent className="flex flex-col h-full pt-4 gap-6">
        <SidebarGroupContent className="px-4 mt-12">
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  asChild
                  variant={action.variant}
                  className={`w-full justify-start shadow-none gap-2 relative group ${
                    pathname === action.url
                      ? "bg-red-500/10 text-red-500"
                      : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                  }`}
                >
                  <Link href={action.url}>
                    <action.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{action.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </SidebarGroup>
        </SidebarGroupContent>

        <SidebarGroupContent className="px-4 flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.description}
                    className="relative group"
                  >
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        pathname === item.url
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="font-medium hidden md:inline-block truncate">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarGroupContent>

        <SidebarGroupContent className="px-4">
          <SidebarGroup>
            <SidebarGroupLabel>Community</SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {communitySection.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        pathname === item.url
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="font-medium hidden md:inline-block">
                        {item.title}
                      </span>
                      {item.badge && item.badge !== 0 && (
                        <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarGroupContent>
        {isAdmin && (
          <SidebarGroupContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {adminSection.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.description}>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          pathname === item.url
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="font-medium hidden md:inline-block">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarGroupContent>
        )}
        {user && (
          <SidebarGroupContent className="mt-auto px-4 pb-4 border-t border-border/40 pt-4">
            <SidebarGroup>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Avatar className="w-9 h-9">
                    <Image
                      src={user.profileImage}
                      alt={user.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </Avatar>
                </div>
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </SidebarGroup>
          </SidebarGroupContent>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
