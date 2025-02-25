"use client";

import { useState } from "react";
import { Ban, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
interface User {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Banned";
  reports: number;
  role: "admin" | "user";
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    reports: 10,
    role: "admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    reports: 5,
    role: "user",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Banned",
    reports: 2,
    role: "user",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    status: "Active",
    reports: 1,
    role: "user",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    status: "Active",
    reports: 3,
    role: "user",
  },
];

const UserList = ({ searchQuery }: { searchQuery: string }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Active" ? "Banned" : "Active" }
          : user
      )
    );

    const updatedUser = users.find((user) => user.id === userId);
    if (updatedUser) {
      toast({
        title: `User ${
          updatedUser.status === "Active" ? "Banned" : "Unbanned"
        }`,
        description: `${updatedUser.name} has been ${
          updatedUser.status === "Active" ? "banned" : "unbanned"
        }.`,
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Reports</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.reports}</TableCell>
            <TableCell>
              {user.role === "admin" ? (
                <Badge variant="default">Admin</Badge>
              ) : (
                <Badge variant="secondary">User</Badge>
              )}
            </TableCell>
            <TableCell>{user.status}</TableCell>
            <TableCell>
              <Button
                variant={user.status === "Active" ? "destructive" : "default"}
                onClick={() => toggleUserStatus(user.id)}
                className="w-28"
              >
                {user.status === "Active" ? (
                  <>
                    <Ban className="mr-2 h-4 w-4" /> Ban
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Unban
                  </>
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default UserList;
