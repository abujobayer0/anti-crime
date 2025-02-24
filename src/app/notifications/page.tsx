"use client";

import { useState, useEffect } from "react";
import { Bell, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useNotifications } from "@/hooks/api/useNotifications";
import { formatDate } from "date-fns";
import { getNotificationIcon } from "@/hooks/useNotificatoins";
import { Notification } from "@/types/notification.types";
import NotificationItem from "./components/NotificationItem";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {
    getNotifications,
    markAllAsRead,
    markNotificationAsRead,
    removeNotification,
  } = useNotifications();

  const { data, isLoading } = getNotifications;

  useEffect(() => {
    if (data) {
      setNotifications(data.data);
    }
  }, [data]);

  const markAsRead = (id: string) => {
    markNotificationAsRead.mutateAsync(id);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleRemoveNotification = (id: string) => {
    removeNotification.mutateAsync(id);
  };

  return (
    <div className=" mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button
            variant="ghost"
            onClick={() => {
              markAllAsRead.mutateAsync();
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
              );
            }}
          >
            Mark all as read
          </Button>
        </div>

        <div className="divide-y dark:divide-gray-700">
          {!isLoading &&
            notifications?.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You&apos;re all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
