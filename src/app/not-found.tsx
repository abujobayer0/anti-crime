"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-md text-center space-y-6 p-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. Please check the
          URL or return to the homepage.
        </p>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
