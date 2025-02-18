"use client";

import React, { useState } from "react";

import {
  Bell,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/api/useAuth";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";
import { Input } from "./input";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const Navbar = () => {
  const { logout: authLogout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  React.useEffect(() => {
    if (debouncedSearch) {
      router.push(`/query?${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, router]);

  return (
    <nav className="w-full z-50 shadow-md bg-white dark:bg-gray-900 flex justify-between items-center py-2 px-4 fixed top-0 transition-all duration-200 ease-in-out">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/anticrime-logo.png"
            width={40}
            height={40}
            alt="AntiCrime logo"
            className="rounded-full"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent hidden md:inline-block">
            AntiCrime
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-1">
          {[
            { icon: Home, href: "/" },
            { icon: Bell, href: "/notifications" },
            { icon: MessageCircle, href: "/messages" },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              asChild
              className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
              </Link>
            </Button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => authLogout.mutate()}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
