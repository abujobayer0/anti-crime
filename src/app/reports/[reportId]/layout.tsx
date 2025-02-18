import { AppSidebar } from "@/components/global/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/ui/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
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
