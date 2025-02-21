import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { ENDPOINTS } from "@/api/config";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.users.getUser);
      return data.data;
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        ENDPOINTS.users.getUserProfile(userId)
      );

      return data.data;
    },
  });
};
