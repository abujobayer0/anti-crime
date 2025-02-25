"use client";
import Link from "next/link";
import { BarChart, Users, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
const links = [
  { href: "/admin", icon: <BarChart className="h-5 w-5" /> },
  { href: "/admin/users", icon: <Users className="h-5 w-5" /> },
  { href: "/admin/reports", icon: <FileText className="h-5 w-5" /> },
  { href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
];

const AdminHeader = () => {
  const pathname = usePathname();
  return (
    <header className="fixed w-fit h-fit left-1/2 -translate-x-1/2 bottom-8 bg-card backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-white/20 z-50">
      <nav className="flex gap-4">
        {links.map(({ href, icon }) => (
          <Link key={href} href={href}>
            <Button
              variant={pathname === href ? "default" : "outline"}
              className={`flex items-center group relative hover:scale-110 transition-all duration-200`}
              size="icon"
            >
              {icon}
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
};
export default AdminHeader;
