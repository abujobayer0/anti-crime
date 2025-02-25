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

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  totalReports: number;
  role: "User" | "Moderator" | "Admin";
  status: "Active" | "Banned";
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    totalReports: 5,
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    totalReports: 12,
    role: "Moderator",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    totalReports: 0,
    role: "User",
    status: "Banned",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    totalReports: 8,
    role: "Admin",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    totalReports: 3,
    role: "User",
    status: "Active",
  },
];
interface UserTableProps {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const UserTable = ({
  searchQuery,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: UserTableProps) => {
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
          <TableHead>Total Reports</TableHead>
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
            <TableCell>{user.totalReports}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.role === "Admin"
                    ? "destructive"
                    : user.role === "Moderator"
                    ? "default"
                    : "secondary"
                }
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={user.status === "Active" ? "default" : "destructive"}
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant={user.status === "Active" ? "destructive" : "default"}
                size="sm"
                onClick={() => toggleUserStatus(user.id)}
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
export default UserTable;
