import React from "react";
import { Notification } from "@/types/notification.types";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { formatDate } from "date-fns";
import { getNotificationIcon } from "@/hooks/useNotificatoins";
import { useNotifications } from "@/hooks/api/useNotifications";
const NotificationItem = ({ notification }: { notification: Notification }) => {
  const { markNotificationAsRead, removeNotification } = useNotifications();
  return (
    <div
      key={notification._id}
      className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
        !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <Image
            src={"/anticrime-logo.png"}
            alt="avater"
            width={40}
            height={40}
          />
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
              {formatDate(notification.createdAt, "MMM d, yyyy hh:mm a")}
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
            {!notification.isRead && (
              <DropdownMenuItem
                onClick={() => markNotificationAsRead.mutate(notification._id)}
              >
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => removeNotification.mutate(notification._id)}
            >
              Remove this notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NotificationItem;
