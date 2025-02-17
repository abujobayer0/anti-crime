import type { Metadata } from "next";
import { AppSidebar } from "@/components/global/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <div>
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </div>

        <div className="p-5 w-full">{children}</div>
      </div>
    </div>
  );
}
