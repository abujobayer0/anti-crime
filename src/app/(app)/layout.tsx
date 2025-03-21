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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex relative pt-16">
        <div className="hidden lg:block w-64 shrink-0">
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>

        <div className="flex-1 min-w-0">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </div>

        <div className="relative w-80 hidden xl:block shrink-0">
          <aside className="sticky top-16 border-l border-gray-200 h-[calc(100vh-4rem)]">
            <div className="p-4 h-full overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
              <RecentReportsLayout />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
