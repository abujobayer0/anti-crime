import { AppSidebar } from "@/components/global/appSidebar";
import Navbar from "@/components/ui/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anti Crime",
  description:
    "Anti Crime is a platform for reporting and tracking crime incidents to create safer neighborhoods.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
