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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col lg:flex-row pt-16">
        <div className="hidden lg:block w-64 shrink-0">
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>

        <main className="flex-1 min-w-0">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </main>

        <aside className="hidden xl:block w-80 shrink-0 border-l border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
            <RecentReportsLayout />
          </div>
        </aside>
      </div>
    </div>
  );
}
