"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminStats from "./AdminStats";
import UserList from "./UserList";
import { getBannedUsers, useUpdateUser } from "@/hooks/api/useUser";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: bannedUsers } = getBannedUsers();
  const { mutate: updateUserMutation } = useUpdateUser();

  const updateUserStatus = async (
    userId: string,
    userData: { isBanned: boolean }
  ) => {
    updateUserMutation({ userId, user: userData });
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminStats />
      <div className="my-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <UserList
        users={bannedUsers}
        searchQuery={searchQuery}
        updateUserStatus={updateUserStatus}
      />
    </main>
  );
}
