"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReportTable from "./components/ReportTable";

const ReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Reports Management</h1>
      <div className="my-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports by title or author email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ReportTable searchQuery={searchQuery} />
    </main>
  );
};
export default ReportsPage;
