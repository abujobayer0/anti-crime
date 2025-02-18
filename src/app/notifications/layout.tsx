import { Metadata } from "next";
import React from "react";
import { AppSidebar } from "@/components/global/appSidebar";
import Navbar from "@/components/ui/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Stay updated with alerts and notifications about crime reports",
  openGraph: {
    title: "Notifications | Anti Crime",
    description: "Your crime alerts and notification center",
  },
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex">
        <div>
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>
        <div className="w-full mt-14">{children}</div>
      </div>
    </div>
  );
}
