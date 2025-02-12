"use client";

import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("accessToken");

    // Clear auth state from Redux
    dispatch(logout());

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <nav className="w-full shadow flex justify-end py-3">
      <div className="flex items-center">
        <Input placeholder="Search..." className="w-[300px] mx-5" />
        <Button
          variant="outline"
          className="mr-2"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
