"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserTable from "./components/UsersTable";
import { User } from "@/types";
import { getAllUsers, useUpdateUser } from "@/hooks/api/useUser";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { data: usersData } = getAllUsers();
  const { mutate: updateUserStatus } = useUpdateUser();

  const handleUpdateUserStatus = (
    userId: string,
    user: { isBanned: boolean }
  ) => {
    updateUserStatus({ userId, user });
  };

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="my-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <UserTable
        searchQuery={searchQuery}
        setUsers={setUsers}
        users={users}
        handleUpdateUserStatus={handleUpdateUserStatus}
      />
    </main>
  );
};

export default UsersPage;
