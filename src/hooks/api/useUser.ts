import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { ENDPOINTS } from "@/api/config";

import { TUser } from "@/types/user.types";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.users.getUser);
      return data.data;
    },
  });
};

export const getAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.users.getAllUsers);
      return data.data;
    },
  });
};

export const getBannedUsers = () => {
  return useQuery({
    queryKey: ["banned-users"],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.users.getBannedUsers);
      return data.data;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      user,
    }: {
      userId: string;
      user: Partial<TUser>;
    }) => {
      const response = await apiClient.patch(
        ENDPOINTS.users.updateUser(userId),
        user
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banned-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
