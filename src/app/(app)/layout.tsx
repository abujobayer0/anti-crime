import { AppSidebar } from "@/components/global/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/ui/Navbar";
import RecentReportsLayout from "./components/RecentReportsLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

        <div className="w-1/3 h-screen overflow-y-scroll sticky top-0 right-0 md:block hidden  p-4">
          <h2 className="text-xl font-semibold mt-14 mb-4">Recent Reports</h2>
          <RecentReportsLayout />
        </div>
      </div>
    </div>
  );
}
