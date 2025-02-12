"use client";

import React, { useState } from "react";
import { Bell, Clock, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "alert" | "update" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "New Crime Report in Your Area",
      message:
        "A new crime has been reported in Gulshan-1. Stay alert and take necessary precautions.",
      timestamp: new Date("2024-03-20T10:30:00"),
      isRead: false,
    },
    {
      id: "2",
      type: "update",
      title: "Evidence Added to Your Report",
      message: "New evidence has been added to your crime report #CR-2024-001.",
      timestamp: new Date("2024-03-19T15:45:00"),
      isRead: true,
    },
    {
      id: "3",
      type: "warning",
      title: "Security Alert",
      message:
        "Multiple incidents reported in Dhanmondi area. Please be cautious.",
      timestamp: new Date("2024-03-19T09:15:00"),
      isRead: false,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <Bell className="w-5 h-5 text-primary" />;
      case "update":
        return <Shield className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5" />;
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
    <div className="container mx-auto px-4 py-6">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button
            variant="outline"
            onClick={() =>
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
              )
            }
          >
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4 w-full">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white w-full rounded-xl shadow-sm p-4 transition-all hover:shadow-md ${
                !notification.isRead ? "border-l-4 border-primary" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                No notifications
              </h3>
              <p className="text-gray-600">
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
