"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";
import { Avatar } from "./avatar";
import {
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Map,
  Home,
  Search,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import Image from "next/image";
import { useAuth } from "@/hooks";
import { useUser } from "@/hooks/api/useUser";

import { SearchCommandMenu } from "@/components/search/SearchCommandMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [query, setQuery] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { data: user } = useUser();

  // Add keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigation = [
    {
      name: "Crime Feed",
      href: "/",
      icon: Home,
      description: "View latest reported incidents",
    },
    {
      name: "Heat Map",
      href: "/heatmap",
      icon: Map,
      description: "Visualize crime hotspots",
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl border-b border-border/40">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/"
              className="flex-shrink-0 transition-opacity hover:opacity-80"
            >
              <Image
                src="/anticrime-logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-auto h-8"
              />
            </Link>
            <div className="flex items-center md:ml-2  md:space-x-1">
              <h2 className="text-2xl font-bold">Anti Crime</h2>
            </div>
          </div>

          <div className="hidden md:flex justify-end flex-1 items-center space-x-2">
            <Button
              variant="outline"
              className="relative w-full max-w-sm justify-start text-sm text-muted-foreground"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              {query ? query : "Search reports..."}
              <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-primary/5"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <Image
                      src={user?.profileImage || "/anticrime-logo.png"}
                      alt={user?.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                sideOffset={5}
                alignOffset={-5}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => logout.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-primary/5"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-white/80 backdrop-blur-lg border-t border-border/40 transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </span>
              </Link>
            );
          })}

          <div className="pt-4 pb-3 border-t border-border/40">
            <div className="flex items-center px-3">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <Image
                    src={user?.profileImage || "/placeholder-avatar.png"}
                    alt={user?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto relative hover:bg-primary/5"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </span>
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout.mutate();
                }}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <SearchCommandMenu
        open={openSearch}
        query={query}
        setQuery={setQuery}
        onOpenChange={setOpenSearch}
        onSelect={(item) => {
          setOpenSearch(false);
          if (item.type === "report") {
            router.push(`/reports/${item._id}`);
          } else if (item.type === "user") {
            if (user?._id === item._id) {
              router.push("/profile");
            } else {
              router.push(`/profile/${item._id}`);
            }
          }
        }}
      />
    </nav>
  );
};

export default Navbar;
