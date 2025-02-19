"use client";

import { useState } from "react";
import { Bell, Shield, AlertTriangle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "alert" | "update" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "New Crime Report",
      message: "A new crime has been reported in Gulshan-1.",
      timestamp: new Date("2024-03-20T10:30:00"),
      isRead: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      type: "update",
      title: "Evidence Added",
      message: "New evidence has been added to your crime report #CR-2024-001.",
      timestamp: new Date("2024-03-19T15:45:00"),
      isRead: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      type: "warning",
      title: "Security Alert",
      message: "Multiple incidents reported in Dhanmondi area.",
      timestamp: new Date("2024-03-19T09:15:00"),
      isRead: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <Bell className="w-5 h-5 text-blue-500" />;
      case "update":
        return <Shield className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil(
        (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
      "day"
    );
  };

  return (
    <div className=" mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button
            variant="ghost"
            onClick={() =>
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
              )
            }
          >
            Mark all as read
          </Button>
        </div>

        <div className="divide-y dark:divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <img src={notification.avatar || "/placeholder.svg"} alt="" />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getNotificationIcon(notification.type)}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Remove this notification
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
