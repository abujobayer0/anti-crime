import { useMutation, useQuery } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { ENDPOINTS } from "@/api/config";

export const useNotifications = () => {
  const { client, handleError, handleSuccess } = useApi();
  const queryClient = useQueryClient();
  const getNotifications = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await client.get(ENDPOINTS.notifications.list);
      return data;
    },
    refetchInterval: 1000 * 30,
  });

  const markNotificationAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await client.patch(ENDPOINTS.notifications.read(id));
      return data;
    },
    onSuccess: () => {
      handleSuccess("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data } = await client.patch(
        ENDPOINTS.notifications.markAllAsRead
      );
      return data;
    },
    onSuccess: () => {
      handleSuccess("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const removeNotification = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await client.delete(ENDPOINTS.notifications.remove(id));
      return data;
    },
    onSuccess: () => {
      handleSuccess("Notification removed successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return {
    getNotifications,
    markAllAsRead,
    markNotificationAsRead,
    removeNotification,
  };
};
