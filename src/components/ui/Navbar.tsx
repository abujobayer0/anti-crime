"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { LogOut, Search } from "lucide-react";
import { useAuth } from "@/hooks/api/useAuth";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { logout: authLogout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  React.useEffect(() => {
    if (debouncedSearch) {
      router.push(`/query?${encodeURIComponent(debouncedSearch)}`);
    } else {
      router.push("/");
    }
  }, [debouncedSearch, router]);

  return (
    <nav className="w-full !z-40 shadow-custom-sm bg-card flex justify-end py-3 fixed top-0 backdrop-blur-sm">
      <div className="flex items-center justify-between w-full  px-8 mx-auto">
        <Link
          href="/"
          className="transition-opacity flex gap-2 hover:opacity-80"
        >
          <Image
            src="/anticrime-logo.png"
            width={36}
            height={36}
            alt="AntiCrime logo"
            className="rounded-xl"
          />

          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden md:inline-block">
            AntiCrime
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative w-[400px] mx-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-9 bg-muted/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
            />
          </div>
          <Button
            variant="outline"
            className="mr-2"
            size="icon"
            onClick={() => authLogout.mutate()}
            title="Logout"
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
