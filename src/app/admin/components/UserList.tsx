"use client";

import { useState, useEffect } from "react";
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
  _id: string;
  name: string;
  email: string;
  isBanned: boolean;
  isVerified: boolean;
  role: "admin" | "user";
  profileImage: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  __v: number;
}

const UserList = ({
  searchQuery,
  users,
  updateUserStatus,
}: {
  searchQuery: string;
  users: User[];
  updateUserStatus: (userId: string, user: { isBanned: boolean }) => void;
}) => {
  const [usersList, setUsersList] = useState<User[]>(users);

  const { toast } = useToast();

  const filteredUsers = usersList?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsersList(
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
      updateUserStatus(userId, { isBanned: !updatedUser.isBanned });
      toast({
        title: `User ${!updatedUser.isBanned ? "Banned" : "Unbanned"}`,
        description: `${updatedUser.name} has been ${
          !updatedUser.isBanned ? "banned" : "unbanned"
        }.`,
      });
    }
  };

  useEffect(() => {
    setUsersList(users);
  }, [users]);

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
        {filteredUsers?.map((user) => (
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
                onClick={() => toggleUserStatus(user._id)}
                className="w-28"
              >
                {!user.isBanned ? (
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
