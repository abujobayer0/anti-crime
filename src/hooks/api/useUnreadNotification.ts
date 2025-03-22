import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNotifications } from "@/hooks/api/useNotifications"; // Assuming this is the hook that fetches notifications
import { Notification } from "@/types/notification.types";
import { setUnreadCount } from "@/redux/features/notification/notificationSlice";

export function useUnreadNotificationCount() {
  const dispatch = useDispatch();
  const { getNotifications } = useNotifications();
  const { data, isLoading } = getNotifications;
  useEffect(() => {
    if (isLoading) return;

    if (data) {
      const unreadNotifications = data.data.notifications.filter(
        (notification: Notification) => !notification.isRead
      );

      dispatch(setUnreadCount(unreadNotifications.length));
    }
  }, [data, isLoading, dispatch]);
}
