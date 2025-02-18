import { AppSidebar } from "@/components/global/appSidebar";
import Navbar from "@/components/ui/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile and view your crime reports",
  openGraph: {
    title: "Profile | Anti Crime",
    description: "Manage your Anti Crime profile and reports",
  },
};

export default function ProfileLayout({
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
