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

import { User } from "@/types";

interface UsersTableProps {
  searchQuery: string;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  handleUpdateUserStatus: (userId: string, user: { isBanned: boolean }) => void;
}

const UserTable = ({
  searchQuery,
  users,
  setUsers,
  handleUpdateUserStatus,
}: UsersTableProps) => {
  const { toast } = useToast();

  const handleStatusChange = (userId: string) => {
    setUsers(
      users.map((user) =>
        user._id === userId
          ? {
              ...user,
              isBanned: !user.isBanned,
            }
          : user
      )
    );

    const updatedUser = users.find((user) => user._id === userId);
    if (updatedUser) {
      handleUpdateUserStatus(userId, { isBanned: !updatedUser.isBanned });

      toast({
        title: `User ${updatedUser.isBanned ? "Unbanned" : "Banned"}`,
        description: `${updatedUser.name} has been ${
          updatedUser.isBanned ? "unbanned" : "banned"
        }.`,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verification</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => (
          <TableRow key={user._id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isVerified ? "Verified" : "Unverified"}</TableCell>
            <TableCell>
              {user.role === "admin" ? (
                <Badge variant="default">Admin</Badge>
              ) : (
                <Badge variant="secondary">User</Badge>
              )}
            </TableCell>
            <TableCell>{user.isBanned ? "Banned" : "Active"}</TableCell>
            <TableCell>
              <Button
                variant={!user.isBanned ? "destructive" : "default"}
                onClick={() => handleStatusChange(user._id)}
                className="w-28"
              >
                {!user.isBanned ? "Ban" : "Unban"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
